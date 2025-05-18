"use client"

import { useState, useEffect } from "react"
import { PlusCircle, DollarSign, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseSummary } from "@/components/expense-summary"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseForm } from "@/components/expense-form"

export type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

export type CategoryTotal = {
  category: string
  total: number
  color: string
}

const CATEGORIES = [
  { name: "Accommodation", color: "bg-blue-500" },
  { name: "Transportation", color: "bg-green-500" },
  { name: "Food", color: "bg-yellow-500" },
  { name: "Activities", color: "bg-purple-500" },
  { name: "Shopping", color: "bg-pink-500" },
  { name: "Other", color: "bg-gray-500" },
]

export function BudgetTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [activeTab, setActiveTab] = useState("expenses")
  const [currency, setCurrency] = useState("USD")

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("vacationExpenses")
    const savedCurrency = localStorage.getItem("vacationCurrency")

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }

    if (savedCurrency) {
      setCurrency(savedCurrency)
    }
  }, [])

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vacationExpenses", JSON.stringify(expenses))
  }, [expenses])

  // Save currency to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vacationCurrency", currency)
  }, [currency])

  const handleAddExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses([...expenses, newExpense])
    setActiveTab("expenses")
  }

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)))
    setEditingExpense(null)
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
  }

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const calculateCategoryTotals = (): CategoryTotal[] => {
    const totals: Record<string, number> = {}

    expenses.forEach((expense) => {
      if (totals[expense.category]) {
        totals[expense.category] += expense.amount
      } else {
        totals[expense.category] = expense.amount
      }
    })

    return Object.entries(totals)
      .map(([category, total]) => {
        const categoryInfo = CATEGORIES.find((c) => c.name === category) || CATEGORIES[CATEGORIES.length - 1]
        return {
          category,
          total,
          color: categoryInfo.color,
        }
      })
      .sort((a, b) => b.total - a.total)
  }

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case "USD":
        return "$"
      case "EUR":
        return "€"
      case "GBP":
        return "£"
      case "JPY":
        return "¥"
      default:
        return "₹"
    }
  }

  const handleCurrencyChange = (value: string) => {
    setCurrency(value)
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Vacation Budget</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Expenses</span>
              <span className="text-3xl font-bold text-blue-700">
                {getCurrencySymbol(currency)}
                {calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <ExpenseForm
                  onSubmit={handleAddExpense}
                  categories={CATEGORIES.map((c) => c.name)}
                  currencySymbol={getCurrencySymbol(currency)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expenses" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Expenses
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Summary
              </TabsTrigger>
            </TabsList>
            <TabsContent value="expenses" className="mt-4">
              <ExpenseList
                expenses={expenses}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
                categories={CATEGORIES}
                currencySymbol={getCurrencySymbol(currency)}
              />
            </TabsContent>
            <TabsContent value="summary" className="mt-4">
              <ExpenseSummary
                expenses={expenses}
                categoryTotals={calculateCategoryTotals()}
                currencySymbol={getCurrencySymbol(currency)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {editingExpense && (
        <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm
              expense={editingExpense}
              onSubmit={handleUpdateExpense}
              categories={CATEGORIES.map((c) => c.name)}
              currencySymbol={getCurrencySymbol(currency)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
