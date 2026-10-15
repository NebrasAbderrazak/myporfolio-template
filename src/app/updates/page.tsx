import type { Metadata } from "next";
import { ListingHeader } from "@/components/layout/ListingHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { Timeline } from "@/components/updates/Timeline";
import { plainEmphasis } from "@/content/emphasis";
import { getUpdatesPage } from "@/content/settings";
import { getUpdates } from "@/content/updates";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  const page = getUpdatesPage();
  return pageMetadata({ title: plainEmphasis(page.title), description: page.intro, path: "/updates/" });
}

export default function UpdatesPage() {
  const updates = getUpdates();

  return (
    <PageTransition>
      <main id="main" tabIndex={-1} className="pt-36 md:pt-44">
        <ListingHeader content={getUpdatesPage()} count={updates.length} />
        <div className="shell mt-16 grid md:mt-24 md:grid-cols-12">
          <div className="md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
            <Timeline updates={updates} />
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
