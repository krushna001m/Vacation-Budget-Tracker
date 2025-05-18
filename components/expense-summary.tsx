"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { format, isThisMonth, isThisWeek, isToday } from "date-fns"
import type { Expense, CategoryTotal } from "./budget-tracker"

interface ExpenseSummaryProps {
  expenses: Expense[]
  categoryTotals: CategoryTotal[]
  currencySymbol: string
}

export function ExpenseSummary({ expenses, categoryTotals, currencySymbol }: ExpenseSummaryProps) {
  const totalAmount = useMemo(() => expenses.reduce((sum, expense) => sum + expense.amount, 0), [expenses])

  const timeFrameTotals = useMemo(() => {
    const today = expenses
      .filter((expense) => isToday(new Date(expense.date)))
      .reduce((sum, expense) => sum + expense.amount, 0)

    const thisWeek = expenses
      .filter((expense) => isThisWeek(new Date(expense.date)))
      .reduce((sum, expense) => sum + expense.amount, 0)

    const thisMonth = expenses
      .filter((expense) => isThisMonth(new Date(expense.date)))
      .reduce((sum, expense) => sum + expense.amount, 0)

    return { today, thisWeek, thisMonth }
  }, [expenses])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currencySymbol}
              {timeFrameTotals.today.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currencySymbol}
              {timeFrameTotals.thisWeek.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currencySymbol}
              {timeFrameTotals.thisMonth.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryTotals.length > 0 ? (
            <div className="space-y-4">
              {categoryTotals.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`${item.color} text-white`}>{item.category}</Badge>
                      <span className="text-sm font-medium">
                        {currencySymbol}
                        {item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{Math.round((item.total / totalAmount) * 100)}%</span>
                  </div>
                  <Progress value={(item.total / totalAmount) * 100} className={item.color} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">No expense data available</div>
          )}
        </CardContent>
      </Card>

      {expenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{expense.description}</p>
                      <p className="text-sm text-gray-500">{format(new Date(expense.date), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${categoryTotals.find((c) => c.category === expense.category)?.color || "bg-gray-500"} text-white`}
                      >
                        {expense.category}
                      </Badge>
                      <span className="font-medium">
                        {currencySymbol}
                        {expense.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
