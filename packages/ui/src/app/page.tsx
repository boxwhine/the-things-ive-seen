import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">The Things I&apos;ve Seen</CardTitle>
          <CardDescription>A concert and event tracking app</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Browse your events and venues using the navigation above.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
