import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Code2, Users, Rocket, Globe2, Sparkles } from 'lucide-react';
import Hero from '@/components/Hero';
import SkillMatchCard from '@/components/SkillMatchCard';
import SkillExchangeCard from '@/components/SkillExchangeCard';

export default function App() {
  const [activeTab, setActiveTab] = useState('exchange');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-accent/10">
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Input
              placeholder="Search skills to exchange..."
              className="w-full pl-12 h-14 text-lg bg-muted/50 border-accent/20 focus:border-accent"
            />
            <Search className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 w-full max-w-md gap-2 p-2 bg-muted/30">
              <TabsTrigger 
                value="exchange" 
                className="data-[state=active]:bg-accent data-[state=active]:text-white px-8 py-3"
              >
                <Users className="mr-2 h-4 w-4" />
                Exchange
              </TabsTrigger>
              <TabsTrigger 
                value="matches" 
                className="data-[state=active]:bg-accent data-[state=active]:text-white px-8 py-3"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Matches
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="exchange" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillExchangeCard
                offering={["React", "TypeScript", "UI Design"]}
                seeking={["Python", "Machine Learning"]}
                name="Alex Chen"
                image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300"
                rating={4.8}
                matches={["TypeScript", "React"]}
              />
              <SkillExchangeCard
                offering={["Python", "Data Science", "SQL"]}
                seeking={["React", "Next.js"]}
                name="Sarah Johnson"
                image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300"
                rating={4.9}
                matches={["Python"]}
              />
              <SkillExchangeCard
                offering={["UI/UX Design", "Figma", "Adobe XD"]}
                seeking={["React", "Frontend Development"]}
                name="Mike Wilson"
                image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300"
                rating={4.7}
                matches={["Design"]}
              />
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillMatchCard
                matchedUser={{
                  name: "David Kim",
                  image: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=300",
                  offering: ["Python", "Machine Learning"],
                  seeking: ["React", "TypeScript"],
                }}
                matchPercentage={95}
                commonAvailability={["Evenings", "Weekends"]}
                matchedSkills={["React", "TypeScript"]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}