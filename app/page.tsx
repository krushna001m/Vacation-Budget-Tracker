import { BudgetTracker } from "@/components/budget-tracker"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Vacation Budget Tracker</h1>
        <p className="text-blue-600 mb-8">Keep track of your expenses and stay within budget</p>
        <BudgetTracker />
      </div>
    </main>
  )
}
