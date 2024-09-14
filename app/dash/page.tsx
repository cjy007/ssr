function Page() {
  return <h1>dash page!</h1>
}
function Page1() {
  return <h1>dash page111!
    <Page/>
      </h1>
}

export default Page1