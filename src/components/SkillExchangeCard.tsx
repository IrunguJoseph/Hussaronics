import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MessageCircle } from 'lucide-react';

interface SkillExchangeCardProps {
  offering: string[];
  seeking: string[];
  name: string;
  image: string;
  rating: number;
  matches: string[];
}

export default function SkillExchangeCard({
  offering,
  seeking,
  name,
  image,
  rating,
  matches,
}: SkillExchangeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <Card className="overflow-hidden glass-card">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img
                src={image}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border-2 border-accent/20"
              />
              <div className="absolute -bottom-1 -right-1 bg-accent text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {rating}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{matches.length} skill matches</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Offering</h4>
              <div className="flex flex-wrap gap-2">
                {offering.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className={matches.includes(skill) ? "bg-accent/20 text-accent" : ""}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Seeking</h4>
              <div className="flex flex-wrap gap-2">
                {seeking.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-accent/20"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full bg-accent hover:bg-accent/90">
              <MessageCircle className="w-4 h-4 mr-2" />
              Propose Exchange
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}