"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Expense } from "./budget-tracker"

interface ExpenseFormProps {
  expense?: Expense
  onSubmit: (expense: Expense | Omit<Expense, "id">) => void
  categories: string[]
  currencySymbol: string
}

export function ExpenseForm({ expense, onSubmit, categories, currencySymbol }: ExpenseFormProps) {
  const [description, setDescription] = useState(expense?.description || "")
  const [amount, setAmount] = useState(expense?.amount.toString() || "")
  const [category, setCategory] = useState(expense?.category || categories[0])
  const [date, setDate] = useState<Date | undefined>(expense?.date ? new Date(expense.date) : new Date())
  const [errors, setErrors] = useState({
    description: false,
    amount: false,
    category: false,
    date: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      description: !description.trim(),
      amount: !amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0,
      category: !category,
      date: !date,
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some(Boolean)) {
      return
    }

    const formattedExpense = {
      ...(expense ? { id: expense.id } : {}),
      description,
      amount: Number(amount),
      category,
      date: date ? date.toISOString() : new Date().toISOString(),
    }

    onSubmit(formattedExpense as any)

    // Reset form if not editing
    if (!expense) {
      setDescription("")
      setAmount("")
      setCategory(categories[0])
      setDate(new Date())
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(errors.description && "border-red-500")}
          />
          {errors.description && <p className="text-sm text-red-500">Description is required</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{currencySymbol}</span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={cn("pl-8", errors.amount && "border-red-500")}
            />
          </div>
          {errors.amount && <p className="text-sm text-red-500">Please enter a valid amount</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className={cn(errors.category && "border-red-500")}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500">Category is required</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  errors.date && "border-red-500",
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-sm text-red-500">Date is required</p>}
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">{expense ? "Update" : "Add"} Expense</Button>
      </DialogFooter>
    </form>
  )
}
