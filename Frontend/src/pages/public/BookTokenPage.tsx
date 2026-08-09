import BookFormSection from "../../components/bookToken/BookFormSection"
import BookHeroSection from "../../components/bookToken/BookHeroSection"
import BookHowItWorks from "../../components/bookToken/BookHowItWorks"

const BookTokenPage = () => {
  return (
    <>
      <title>Book Appointment — ClinicBook</title>
      <meta
        name="description"
        content="Book a doctor appointment online in minutes. Choose your specialist, pick a time, and get your token."
      />

      <BookHeroSection />
      <BookFormSection />
      <BookHowItWorks />
    </>
  )
}

export default BookTokenPage
