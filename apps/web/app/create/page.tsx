export default function CreatePage() {
  return (
    <form action="/api/obituaries" method="post" encType="multipart/form-data" className="grid gap-2 max-w-xl">
      <h1 className="text-xl font-semibold">Create Notice</h1>
      <input className="border p-2" name="fullName" placeholder="Full name" required />
      <input className="border p-2" name="county" placeholder="County" required />
      <input className="border p-2" type="date" name="dod" required />
      <input className="border p-2" name="primaryContactName" placeholder="Contact name" required />
      <input className="border p-2" name="primaryContactPhone" placeholder="Phone" required />
      <input className="border p-2" name="honeypot" placeholder="Leave empty" />
      <label>Death Certificate <input type="file" name="deathCert" required /></label>
      <label>Requester ID <input type="file" name="requesterId" required /></label>
      <button className="bg-black text-white p-2">Submit</button>
    </form>
  );
}
