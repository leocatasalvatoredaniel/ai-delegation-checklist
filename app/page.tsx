import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { Stats } from "@/components/sections/stats";
import { Invitation } from "@/components/sections/invitation";
import { Milestones } from "@/components/sections/milestones";
import { Rsvp } from "@/components/sections/rsvp";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Journey />
      <Stats />
      <Invitation />
      <Milestones />
      <Rsvp />
    </main>
  );
}
