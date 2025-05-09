import Card from "./Card"

const Features = () => {
  return (
    <section id="features">
      <h1 className="text-6xl font-bold text-center">Features</h1>
      <div className="flex space-y-4 md:space-y-0 md:space-x-4 py-24 max-w-6xl justify-self-center flex-wrap md:flex-nowrap">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </section>
  )
}

export default Features