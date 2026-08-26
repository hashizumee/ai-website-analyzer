import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getScoreStatus } from "@/lib/scoring";
import { Progress } from "@/components/ui/progress";

interface ScoreCardProps {
  title: string;
  score: number;
  icon?: React.ReactNode;
  size?: "sm" | "lg";
}

export default function ScoreCard({ title, score, icon, size = "sm" }: ScoreCardProps) {
  const status = getScoreStatus(score);
  
  if (size === "lg") {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-card to-muted/50 border-2">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <div className={`text-6xl font-black my-4 ${status.colorClass}`}>
          {score}
        </div>
        <div className={`px-4 py-1 rounded-full text-sm font-semibold border ${status.colorClass} border-current bg-background/50`}>
          {status.label}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{score}/100</div>
        <p className={`text-xs ${status.colorClass} font-medium mt-1`}>
          {status.label}
        </p>
        <Progress value={score} className="h-2 mt-3" indicatorColor={status.bgClass} />
      </CardContent>
    </Card>
  );
}
