
import React from 'react';

// Temporary stub component until the actual component is implemented
export const LearningContent = () => {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-xl font-bold mb-4">Learning Path</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="border-l-2 border-primary pl-4">
            <h4 className="font-medium">Module {item}</h4>
            <p className="text-sm text-muted-foreground">Description of this learning module</p>
            <button className="text-sm text-primary mt-1">Start Learning</button>
          </div>
        ))}
      </div>
    </div>
  );
};
