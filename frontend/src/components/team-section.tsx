'use client';

import React from 'react';
import { GraduationCap, Github, Linkedin, ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      initials: 'SU',
      badgeBg: 'bg-blue-600 text-white',
      name: 'Syed Uzair Mohiuddin',
      role: 'Full Stack & AI Engineer',
      contrib: 'Frontend, FastAPI backend, deployment pipeline, and multimodal inference integration.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    {
      initials: 'SC',
      badgeBg: 'bg-purple-600 text-white',
      name: 'Sarasam Chinmaee Reddy',
      role: 'AI Architect',
      contrib: 'System architecture, clinical AI workflow design, and ML pipeline strategy.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    {
      initials: 'MY',
      badgeBg: 'bg-emerald-600 text-white',
      name: 'Manohar Yadav Boddu',
      role: 'Machine Learning Engineer',
      contrib: 'Model training, feature engineering, SHAP explainability, and evaluation.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  ];

  return (
    <section className="py-16 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-widest text-zinc-400 font-mono">
            TEAM
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Built by three students.
          </h2>
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Vardhaman College of Engineering, Hyderabad — B.Tech CSE, 2025–26.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="ui-card p-6 flex flex-col justify-between space-y-4 bg-white dark:bg-zinc-900 rounded-2xl border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${member.badgeBg}`}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{member.name}</h3>
                    <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{member.role}</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                  {member.contrib}
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5"
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
