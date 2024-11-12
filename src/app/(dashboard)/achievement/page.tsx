"use client";

import { cloneElement, useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import ShadCN Card components
import { CheckCircle, Trophy, Edit, Trash } from "lucide-react"; // Sử dụng Lucide icons
import GradientButton from "@/components/gradient-button";
import Lottie from "lottie-react";
import backgroundAnimation from "../../../../public/animations/backgroundAnimation.json";

const achievementsData = [
  {
    id: 1,
    title: "Create Your First Task",
    description:
      "Congratulations on creating your first todo! You've started your journey to organize your tasks.",
    icon: <Trophy className="text-yellow-500" />, // No need to set size here
    requirement: "Create your first todo item.",
  },
  {
    id: 2,
    title: "Complete Your First Task",
    description:
      "Congratulations on completing your first todo! You're one step closer to accomplishing your goals.",
    icon: <CheckCircle className="text-green-500" />,
    requirement: "Mark your first todo as completed.",
  },
  {
    id: 3,
    title: "Complete 5 Tasks",
    description: "Amazing! You've completed 5 tasks. Keep up the great work!",
    icon: <Trophy className="text-blue-500" />,
    requirement: "Complete at least 5 tasks.",
  },
  {
    id: 4,
    title: "Update Your Task",
    description:
      "You've updated a task! Modifying your tasks helps you stay on top of your work.",
    icon: <Edit className="text-orange-500" />,
    requirement: "Update at least one task.",
  },
  {
    id: 5,
    title: "Delete a Task",
    description:
      "You've removed a task from your list. Organization is key to better task management.",
    icon: <Trash className="text-red-500" />,
    requirement: "Delete a todo item.",
  },
  {
    id: 6,
    title: "Complete All Tasks",
    description:
      "All tasks are completed! You've successfully finished your day of work.",
    icon: <Trophy className="text-yellow-400" />,
    requirement: "Complete all tasks in your list.",
  },
  //   {
  //     id: 7,
  //     title: "Complete Tasks for a Week",
  //     description:
  //       "You've maintained consistency with your tasks for a week. Keep it up!",
  //     icon: <Calendar className="text-green-500" />,
  //     requirement: "Complete at least one task each day for a week.",
  //   },
];

const AchievementPage = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(
    null,
  );

  return (
    <div className="flex-1 space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Typography</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {achievementsData.map((achievement) => (
          <AlertDialog
            key={achievement.id}
            open={selectedAchievement === achievement.id}
          >
            <AlertDialogTrigger asChild>
              <Card>
                <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                  <div className="space-y-1">
                    <CardTitle>{achievement.title}</CardTitle>
                    <CardDescription>{achievement.requirement}</CardDescription>
                  </div>
                  <div className="flex justify-end">
                    {cloneElement(achievement.icon, {
                      style: { height: 76, width: 76 },
                    })}
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-center">
                  <GradientButton
                    className="w-full"
                    fromColor="#a18cd1"
                    toColor="#fbc2ea"
                    onClick={() => setSelectedAchievement(achievement.id)}
                  >
                    View Details
                  </GradientButton>
                </CardFooter>
              </Card>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-96 rounded-xl">
              <AlertDialogHeader>
                <div className="relative flex items-center justify-center">
                  <Lottie
                    className="flex h-64 w-64"
                    animationData={backgroundAnimation}
                    loop={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-background">
                      {/* <div className="h-40 w-64">{achievement.icon}</div> */}
                      {cloneElement(achievement.icon, {
                        style: { height: 160, width: 160 },
                      })}
                    </div>
                    {/* Apply pulsing to icon */}
                  </div>
                </div>

                <AlertDialogTitle className="text-center">
                  Congratulations!
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  {achievement.description}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="items-center sm:justify-center">
                <AlertDialogAction asChild>
                  <GradientButton
                    className="w-full"
                    fromColor="#a18cd1"
                    toColor="#fbc2ea"
                    onClick={() => setSelectedAchievement(null)}
                  >
                    Continue
                  </GradientButton>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>
    </div>
  );
};

export default AchievementPage;
