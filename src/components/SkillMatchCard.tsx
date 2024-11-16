import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, Sparkles } from 'lucide-react';

interface MatchedUser {
  name: string;
  image: string;
  offering: string[];
  seeking: string[];
}

interface SkillMatchCardProps {
  matchedUser: MatchedUser;
  matchPercentage: number;
  commonAvailability: string[];
  matchedSkills: string[];
}

export default function SkillMatchCard({
  matchedUser,
  matchPercentage,
  commonAvailability,
  matchedSkills,
}: SkillMatchCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <Card className="overflow-hidden glass-card border-accent/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={matchedUser.image}
                alt={matchedUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-accent/20"
              />
              <div>
                <h3 className="text-lg font-semibold">{matchedUser.name}</h3>
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles className="w-4 h-4" />
                  <span>{matchPercentage}% Match</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Matched Skills</h4>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-accent/20 text-accent"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Common Availability
              </h4>
              <div className="flex flex-wrap gap-2">
                {commonAvailability.map((time) => (
                  <Badge key={time} variant="outline" className="border-accent/20">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button className="flex-1 bg-accent hover:bg-accent/90">
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}