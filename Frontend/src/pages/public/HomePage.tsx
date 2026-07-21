// ──────────────────────────────────────────────────────────────────────────────
// HomePage — orchestrator
// All sections have been extracted into individual files under:
//   src/components/home/
//
// Expo design system applied (see Frontend/expo/DESIGN.md):
//   • Colors   : canvas #f5f5f5, ink #0c0a09, orbs #a7e5d3/#c8b8e0/#f4c5a8
//   • Type     : EB Garamond 300 (display) · Inter 400/500/600 (body/UI)
//   • Spacing  : 96px section rhythm, 24px card padding
//   • Shapes   : buttons 8px · cards 12-16px · orb cards 24px
// ──────────────────────────────────────────────────────────────────────────────
import {
  FontLink,
  HeroSection,
  StatsStrip,
  OrbCardsSection,
  FeatureCardsSection,
  TokenShowcaseSection,
  TestimonialsSection,
  CtaBandSection,
} from "../../components/home"

const HomePage = () => (
  <>
    {/* Google Fonts — EB Garamond + Inter */}
    <FontLink />

    {/* SEO meta */}
    <title>ClinicBook — Modern Hospital Appointment Management</title>
    <meta
      name="description"
      content="Book doctor appointments, track live queues, and manage your health records with ClinicBook."
    />

    {/* ── Page sections (top → bottom) ── */}
    <HeroSection />
    <StatsStrip />
    <OrbCardsSection />
    <FeatureCardsSection />
    <TokenShowcaseSection />
    <TestimonialsSection />
    <CtaBandSection />
  </>
)

export default HomePage
