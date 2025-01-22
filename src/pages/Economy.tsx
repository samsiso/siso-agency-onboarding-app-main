import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Economy = () => {
  const sections = [
    {
      title: "How to Earn",
      description: "Learn different ways to earn points",
      path: "/economy/earn"
    },
    {
      title: "Crypto Exchange",
      description: "Convert your points to cryptocurrency",
      path: "/economy/crypto-exchange"
    },
    {
      title: "Leaderboards",
      description: "See top earners and rankings",
      path: "/economy/leaderboards"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Economy</h1>
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

export default Economy;