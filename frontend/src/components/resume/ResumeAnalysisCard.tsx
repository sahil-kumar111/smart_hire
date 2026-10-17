import type { ResumeAnalysis } from "../../services/resumeService";
import {
    Brain,
    Code2,
    Heart,
    Layers,
    Wrench,
    Database,
    Cloud,
    Award,
    GraduationCap,
    Briefcase,
    FolderKanban,
} from "lucide-react";

interface Props {
    analysis: ResumeAnalysis;
}

function SkillPills({
    title,
    items,
    icon,
    iconBg,
}: {
    title: string;
    items: string[];
    icon: React.ReactNode;
    iconBg: string;
}) {
    if (!items || items.length === 0) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
                    {icon}
                </div>
                <h3 className="text-[14px] font-semibold text-gray-800">
                    {title}
                </h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium bg-blue-50 text-blue-700 border border-blue-100"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function ResumeAnalysisCard({ analysis }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-100">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Brain size={22} className="text-blue-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        AI Resume Analysis
                    </h2>
                    <p className="text-sm text-gray-500">
                        Skills, education, experience and projects extracted from your resume
                    </p>
                </div>
            </div>

            {/* Skills – two columns */}
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-2">
                <SkillPills
                    title="Technical Skills"
                    items={analysis.technical_skills}
                    icon={<Code2 size={15} className="text-blue-600" />}
                    iconBg="bg-blue-50"
                />
                <SkillPills
                    title="Soft Skills"
                    items={analysis.soft_skills}
                    icon={<Heart size={15} className="text-rose-500" />}
                    iconBg="bg-rose-50"
                />
                <SkillPills
                    title="Frameworks"
                    items={analysis.frameworks}
                    icon={<Layers size={15} className="text-violet-600" />}
                    iconBg="bg-violet-50"
                />
                <SkillPills
                    title="Tools"
                    items={analysis.tools}
                    icon={<Wrench size={15} className="text-amber-600" />}
                    iconBg="bg-amber-50"
                />
                <SkillPills
                    title="Databases"
                    items={analysis.databases}
                    icon={<Database size={15} className="text-emerald-600" />}
                    iconBg="bg-emerald-50"
                />
                <SkillPills
                    title="Cloud"
                    items={analysis.cloud}
                    icon={<Cloud size={15} className="text-sky-600" />}
                    iconBg="bg-sky-50"
                />
                <SkillPills
                    title="Certifications"
                    items={analysis.certifications}
                    icon={<Award size={15} className="text-orange-500" />}
                    iconBg="bg-orange-50"
                />
            </div>

            {/* Education */}
            {analysis.education?.length > 0 && (
                <div className="mt-4 mb-8">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <GraduationCap size={15} className="text-indigo-600" />
                        </div>
                        <h3 className="text-[14px] font-semibold text-gray-800">
                            Education
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {analysis.education.map((edu, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
                            >
                                <h4 className="font-semibold text-gray-900 text-[15px]">
                                    {edu.degree}
                                </h4>
                                <p className="text-sm text-gray-700 mt-0.5">
                                    {edu.institution}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                                    <span>
                                        {edu.start_date} – {edu.end_date}
                                    </span>
                                    {(edu.gpa || edu.grade) && (
                                        <span className="text-blue-600 font-medium">
                                            {edu.gpa || edu.grade}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {analysis.experience?.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Briefcase size={15} className="text-blue-600" />
                        </div>
                        <h3 className="text-[14px] font-semibold text-gray-800">
                            Experience
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {analysis.experience.map((exp, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
                            >
                                <h4 className="font-semibold text-gray-900 text-[15px]">
                                    {exp.title}
                                </h4>
                                <p className="text-sm text-gray-700 mt-0.5">
                                    {exp.company}
                                    {exp.location && (
                                        <span className="text-gray-500">
                                            {" "}
                                            • {exp.location}
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {exp.start_date} – {exp.end_date}
                                </p>

                                {exp.description?.length > 0 && (
                                    <ul className="mt-3 space-y-1.5">
                                        {exp.description.map((line, i) => (
                                            <li
                                                key={i}
                                                className="text-sm text-gray-600 flex gap-2"
                                            >
                                                <span className="text-blue-400 mt-[7px] text-[8px]">
                                                    ●
                                                </span>
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {analysis.projects?.length > 0 && (
                <div>
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                            <FolderKanban size={15} className="text-violet-600" />
                        </div>
                        <h3 className="text-[14px] font-semibold text-gray-800">
                            Projects
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {analysis.projects.map((project, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
                            >
                                <h4 className="font-semibold text-gray-900 text-[15px]">
                                    {project.title}
                                </h4>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {project.start_date} – {project.end_date}
                                </p>

                                {project.tech_stack?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 my-3">
                                        {project.tech_stack.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {project.description?.length > 0 && (
                                    <ul className="mt-2 space-y-1.5">
                                        {project.description.map((line, i) => (
                                            <li
                                                key={i}
                                                className="text-sm text-gray-600 flex gap-2"
                                            >
                                                <span className="text-violet-400 mt-[7px] text-[8px]">
                                                    ●
                                                </span>
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
7