
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { NavLink } from "@/components/ui/nav-link";

const tasks = [
  {
    name: "Approve UI Designs",
    dueDate: "2025-04-23",
    priority: "High",
    status: "Overdue",
  },
  {
    name: "Implement Web3 Integration",
    dueDate: "2025-04-25",
    priority: "Medium",
    status: "In Progress",
  },
  {
    name: "Security Audit",
    dueDate: "2025-04-28",
    priority: "High",
    status: "Pending",
  },
];

export function ActiveTasksSection() {
  return (
    <Card className="p-6 bg-black/30 border-siso-text/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Active Tasks</h3>
        <NavLink href="/projects/tasks" className="flex items-center gap-2 text-[#9b87f5] hover:text-[#9b87f5]/80">
          <span>See All Tasks</span>
          <ArrowRight className="w-4 h-4" />
        </NavLink>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
              <th className="pb-2">Task Name</th>
              <th className="pb-2">Due Date</th>
              <th className="pb-2">Priority</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {tasks.map((task, index) => (
              <tr key={index} className="border-b border-gray-800 last:border-0">
                <td className="py-3 text-white">{task.name}</td>
                <td className="py-3 text-gray-300">{task.dueDate}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.priority === "High" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.status === "Overdue" ? "bg-red-500/20 text-red-400" :
                    task.status === "In Progress" ? "bg-blue-500/20 text-blue-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="py-3">
                  <Button variant="ghost" size="sm" className="text-[#9b87f5] hover:text-[#9b87f5]/80">
                    <Check className="w-4 h-4 mr-1" />
                    Complete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
