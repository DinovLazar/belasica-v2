import { Container } from "@/components/Container";

// Minimal placeholder to prove the shell renders. The real homepage is
// Phase 1.05.
export default function Home() {
  return (
    <Container className="py-16 md:py-24">
      <h1 className="font-serif text-h1 font-semibold text-navy md:text-display">
        ФК Беласица
      </h1>
      <p className="mt-4 max-w-measure text-body-l text-neutral-700">
        Неофицијална архива. Почетната страница е во изработка.
      </p>
    </Container>
  );
}
