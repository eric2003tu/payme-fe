"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const TEAM = [
  {
    name: "Sarah Chen",
    role: "CEO & Founder",
    bio: "Former Head of Fintech at Global Bank, 15+ years in financial technology",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    achievements: ["Forbes 30 Under 30", "Fintech Innovator Award 2023"],
  },
  {
    name: "Marcus Johnson",
    role: "CTO",
    bio: "Ex-Google AI researcher, specializes in blockchain and machine learning",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    achievements: ["Published 12 AI papers", "Patent holder in blockchain"],
  },
  {
    name: "Priya Sharma",
    role: "Head of Risk",
    bio: "15 years in credit risk management at leading financial institutions",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    achievements: ["CFA Charterholder", "Risk Management Excellence Award"],
  },
];

export default function LeadershipTeam() {
  return (
    <div className="container-fluid py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Leadership Team</h2>
        <p className="mt-4 text-slate-600">Experienced professionals driving financial innovation</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="relative h-48 w-48 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white shadow-xl">
              <Image src={member.image} alt={member.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <h3 className="text-2xl font-bold">{member.name}</h3>
            <p className="text-blue font-semibold text-lg">{member.role}</p>
            <p className="mt-4 text-slate-600">{member.bio}</p>
            <div className="mt-4 space-y-1">
              {member.achievements.map((achievement, idx) => (
                <span key={idx} className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 mr-2 mb-2">
                  {achievement}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
