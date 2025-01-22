import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const LearnNetwork = () => {
  const sections = [
    {
      title: "Education",
      description: "Access educational resources and tutorials",
      path: "/education"
    },
    {
      title: "Tools",
      description: "Discover and use AI tools",
      path: "/tools"
    },
    {
      title: "Networking",
      description: "Connect with other members",
      path: "/networking"
    },
    {
      title: "GPT Assistants",
      description: "Access specialized AI assistants",
      path: "/assistants"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Learn & Network</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link key={section.path} to={section.path}>
            <Card className="p-6 hover:bg-accent transition-colors">
              <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
              <p className="text-muted-foreground">{section.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LearnNetwork;