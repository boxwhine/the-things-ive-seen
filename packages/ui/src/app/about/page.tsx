import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Things I&apos;ve Seen is an app for tracking and visualizing the concerts, shows,
            and events you&apos;ve attended over the years.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
