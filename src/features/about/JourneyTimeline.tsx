"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Building, ChartBar, MapPin, UserCheck, Cpu, Rocket } from "lucide-react";

const MILESTONES = [
  {
    year: "2020",
    title: "Founded",
    description: "Launched with a vision to disrupt traditional lending",
    side: "left" as const,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    imageAlt: "Startup office with team celebrating launch",
    icon: Building,
    stats: ["Seed funding: $2M", "Team: 8 people", "First loan: $500"],
  },
  {
    year: "2021",
    title: "Series A Funding",
    description: "Raised $8M to expand our technology platform",
    side: "right" as const,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    imageAlt: "Investment meeting and handshake",
    icon: ChartBar,
    stats: ["Investors: 5 VCs", "Valuation: $40M", "Users: 10,000+"],
  },
  {
    year: "2022",
    title: "Global Expansion",
    description: "Launched in 15 new countries across 3 continents",
    side: "left" as const,
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    imageAlt: "World map showing global expansion",
    icon: MapPin,
    stats: ["Countries: 15", "Languages: 8", "Currencies: 12"],
  },
  {
    year: "2023",
    title: "1 Million Users",
    description: "Reached milestone of 1 million registered users",
    side: "right" as const,
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    imageAlt: "Team celebrating user milestone",
    icon: UserCheck,
    stats: ["Total users: 1M", "Active loans: 25,000+", "Loan volume: $25M"],
  },
  {
    year: "2024",
    title: "AI Integration",
    description: "Launched AI-powered credit scoring and risk assessment",
    side: "left" as const,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    imageAlt: "AI and data visualization dashboard",
    icon: Cpu,
    stats: ["Accuracy: 94%", "Speed: 2 seconds", "Reduced defaults: 35%"],
  },
];

export default function JourneyTimeline() {
  return (
    <div className="container-fluid py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue via-purple to-pink hidden md:block" />

        {MILESTONES.map((milestone, i) => (
          <motion.div
            key={milestone.year}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative mb-12 md:mb-16 ${milestone.side === 'left' ? 'md:pr-8' : 'md:pl-8 md:ml-auto'} md:w-1/2`}
          >
            <div className={`hidden md:block absolute top-8 ${milestone.side === 'left' ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}`}>
              <div className="h-8 w-8 rounded-full bg-white border-4 border-blue flex items-center justify-center">
                <milestone.icon className="h-4 w-4 text-blue" />
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-4 left-4 z-10 rounded-lg bg-gradient-to-r from-blue to-pink px-4 py-2 text-white font-bold shadow-lg">
                {milestone.year}
              </div>

              <div className="relative h-48 w-full">
                <Image src={milestone.image} alt={milestone.imageAlt} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="p-6">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 ${milestone.side === 'right' ? 'order-2 ml-3' : 'mr-3'}`}>
                    <div className={`rounded-lg ${milestone.side === 'left' ? 'bg-blue/10' : 'bg-pink/10'} p-3`}>
                      <milestone.icon className={`h-6 w-6 ${milestone.side === 'left' ? 'text-blue' : 'text-pink'}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-slate-600 mb-4">{milestone.description}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {milestone.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="text-center">
                          <div className="text-xs font-medium text-slate-500 mb-1">{stat.split(':')[0]}</div>
                          <div className="text-sm font-semibold">{stat.split(':')[1]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center mt-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue to-pink px-6 py-3 text-white font-bold">
          <Rocket className="h-5 w-5" />
          The Journey Continues...
        </div>
        <p className="mt-4 text-slate-600">Join us as we build the future of finance</p>
      </motion.div>
    </div>
  );
}
