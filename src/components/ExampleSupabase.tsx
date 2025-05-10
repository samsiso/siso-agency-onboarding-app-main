import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

interface ExampleData {
  id: number
  created_at: string
  // Add other fields from your table here
}

export function ExampleSupabase() {
  const supabase = useSupabaseClient()
  const [data, setData] = useState<ExampleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('your_table_name')
          .select('*')
          .limit(10)

        if (error) {
          throw error
        }

        setData(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data from Supabase</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
} 