import Card from "./Card"

const Features = () => {
  return (
    <>
      <h1 className="text-6xl font-bold text-center">Features</h1>
      <div className="flex space-x-4 py-24">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </>
  )
}

export default Features