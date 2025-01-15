import { Tool } from './types';

interface ToolTagsProps {
  tool: Tool;
}

export function ToolTags({ tool }: ToolTagsProps) {
  return (
    <>
      {tool.specialization && tool.specialization.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-siso-text-bold">Specializations</h2>
          <div className="flex flex-wrap gap-2">
            {tool.specialization.map((spec, index) => (
              <span 
                key={index}
                className="text-sm px-3 py-1 rounded-full bg-siso-text/10 text-siso-text hover:bg-siso-text/20 transition-colors cursor-default"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}

      {tool.content_themes && tool.content_themes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-siso-text-bold">Content Themes</h2>
          <div className="flex flex-wrap gap-2">
            {tool.content_themes.map((theme, index) => (
              <span 
                key={index}
                className="text-sm px-3 py-1 rounded-full bg-siso-orange/10 text-siso-orange hover:bg-siso-orange/20 transition-colors cursor-default"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {tool.use_cases && tool.use_cases.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-siso-text-bold">Use Cases</h2>
          <ul className="list-disc pl-6 space-y-2">
            {tool.use_cases.map((useCase, index) => (
              <li key={index} className="text-siso-text">{useCase}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}