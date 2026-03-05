"use client";

import { useQuery } from "@apollo/client/react";
import GET_VENUES, { type Response, type Venue } from "@/graphql/queries/getVenues";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Venues() {
  const { loading, error, data } = useQuery<Response>(GET_VENUES);

  if (loading) return <p className="text-muted-foreground">Loading venues...</p>;
  if (error) return <p className="text-destructive">Error: {error.message}</p>;

  const venues = data?.fetchVenues ?? [];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Venues</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue: Venue) => (
            <TableRow key={venue.id}>
              <TableCell className="font-medium">{venue.name}</TableCell>
              <TableCell>{venue.city}</TableCell>
              <TableCell>{venue.state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
