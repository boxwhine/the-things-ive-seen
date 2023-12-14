'use client'

import { useQuery } from '@apollo/client';
import Link from 'next/link';

import GET_EVENTS from '../../graphql/queries/getEvents';

export default function Events() {
  const {data, error, loading} = useQuery(GET_EVENTS);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section>
      <h1>Events</h1>

      <Link href="/events/new">Add Event...</Link>

      <ul>
        {data.fetchEvents.map(({ name, id }) => (
          <li key={id}>
            <span className="event-name">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
