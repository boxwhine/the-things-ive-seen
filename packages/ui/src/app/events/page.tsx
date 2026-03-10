"use client";

import { useQuery } from "@apollo/client/react";
import GET_EVENTS, {
  type Response,
  type Event,
} from "@/graphql/queries/getEvents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Events() {
  const { loading, error, data } = useQuery<Response>(GET_EVENTS);

  if (loading)
    return <p className="text-muted-foreground">Loading events...</p>;
  if (error) return <p className="text-destructive">Error: {error.message}</p>;

  const events = data?.fetchEvents ?? [];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Events</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Genre</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event: Event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.name}</TableCell>
              <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <div>{event.venue.name}</div>
                <div className="text-sm text-muted-foreground">
                  {event.venue.city}, {event.venue.state}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {event.genre.name}
                  {event.subGenre && (
                    <Badge variant="secondary">{event.subGenre.name}</Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
