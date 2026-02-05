'use client';

import { motion } from 'framer-motion';
import { Calendar, Target, TrendingUp, Globe, Rocket, CheckCircle, Users } from 'lucide-react';

const phases = [
  {
    id: 1,
    title: 'Pre‑Sensor & Pilot',
    period: 'Months 0-9',
    status: 'in-progress',
    milestones: [
      { title: 'MVP Completion', completed: true },
      { title: 'TokenHub + VOD Credits (pre‑sensor)', completed: true },
      { title: 'IoT Sensor R&D Funding', completed: false },
      { title: 'Pilot Data Validation Framework', completed: false },
    ],
    metrics: {
      users: '1K-10K',
      regions: '1-3',
      projects: '8-15',
    },
  },
  {
    id: 2,
    title: 'Data Anchoring & Mint',
    period: 'Months 9-24',
    status: 'planned',
    milestones: [
      { title: 'Sensor Prototype & Pilot Deployment', completed: false },
      { title: 'IoT Oracle + Verification Pipeline', completed: false },
      { title: 'Water Index Governance v1', completed: false },
      { title: 'WTR Minting on Verified Data', completed: false },
      { title: 'DAO Implementation (initial)', completed: false },
      { title: 'International Standardization Draft', completed: false },
    ],
    metrics: {
      users: '10K-50K',
      regions: '3-8',
      projects: '20-60',
    },
  },
  {
    id: 3,
    title: 'Scale & Institutional',
    period: 'Months 24-48',
    status: 'planned',
    milestones: [
      { title: 'Mass Sensor Manufacturing', completed: false },
      { title: 'Global Water Data Coverage', completed: false },
      { title: 'Full DAO Governance', completed: false },
      { title: 'Institutional Partnerships & Standards', completed: false },
      { title: 'Ecosystem Expansion', completed: false },
    ],
    metrics: {
      users: '100K+',
      regions: 'Global',
      projects: '100+',
    },
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Development Roadmap</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our journey to revolutionize water resource management through blockchain technology
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-12">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Timeline Line */}
              {index < phases.length - 1 && (
                <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-gradient-to-b from-cyan-glow/50 to-transparent" />
              )}

              <div className="flex gap-6">
                {/* Timeline Dot */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      phase.status === 'in-progress'
                        ? 'bg-gradient-to-br from-cyan-glow to-blue-500'
                        : phase.status === 'completed'
                        ? 'bg-emerald-500'
                        : 'glass border-2 border-cyan-glow/30'
                    }`}
                  >
                    {phase.status === 'completed' ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <Target className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-black text-white mb-1">{phase.title}</h2>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>{phase.period}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        phase.status === 'in-progress'
                          ? 'bg-cyan-glow/20 text-cyan-glow'
                          : phase.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'glass text-slate-400'
                      }`}
                    >
                      {phase.status === 'in-progress' ? 'In Progress' : phase.status === 'completed' ? 'Completed' : 'Planned'}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="glass p-3 rounded-xl text-center">
                      <Users className="w-5 h-5 text-cyan-glow mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">{phase.metrics.users}</div>
                      <div className="text-xs text-slate-400">Users</div>
                    </div>
                    <div className="glass p-3 rounded-xl text-center">
                      <Globe className="w-5 h-5 text-cyan-glow mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">{phase.metrics.regions}</div>
                      <div className="text-xs text-slate-400">Regions</div>
                    </div>
                    <div className="glass p-3 rounded-xl text-center">
                      <Target className="w-5 h-5 text-cyan-glow mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">{phase.metrics.projects}</div>
                      <div className="text-xs text-slate-400">Projects</div>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">Key Milestones</h3>
                    <div className="space-y-2">
                      {phase.milestones.map((milestone, mIndex) => (
                        <div
                          key={mIndex}
                          className="flex items-center gap-3 p-3 glass rounded-xl"
                        >
                          {milestone.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-cyan-glow/30 flex-shrink-0" />
                          )}
                          <span
                            className={`${
                              milestone.completed ? 'text-slate-400 line-through' : 'text-white'
                            }`}
                          >
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
