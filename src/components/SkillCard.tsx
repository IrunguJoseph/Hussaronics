import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface SkillCardProps {
  title: string;
  level: string;
  users: number;
  image: string;
}

export default function SkillCard({ title, level, users, image }: SkillCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden">
        <div className="relative h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="secondary">{level}</Badge>
              <div className="flex items-center text-white text-sm">
                <Users className="h-4 w-4 mr-1" />
                {users} users
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}