import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { IndianRupee, User, Book, Calendar, ArrowUpRight } from 'lucide-react';

interface Transaction {
  id: string;
  userName: string;
  userEmail: string;
  courseName: string;
  courseId: string;
  amount: number;
  date: string;
}

const RevenuePage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/revenue/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Revenue Insights</h2>
          <p className="text-gray-400 mt-1 text-sm">Real-time ledger of all course enrollments and payments.</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 px-6 py-4 rounded-2xl text-right">
            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Total Gross Revenue</div>
            <div className="text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatMiniCard title="Average Order" value={`₹${transactions.length ? Math.round(totalRevenue/transactions.length).toLocaleString() : 0}`} icon={<ArrowUpRight size={16} />} />
          <StatMiniCard title="Total Sales" value={transactions.length.toString()} icon={<Book size={16} />} />
          <StatMiniCard title="Conversion Share" value="12.4%" icon={<User size={16} />} />
          <StatMiniCard title="This Month" value={`₹${totalRevenue.toLocaleString()}`} icon={<IndianRupee size={16} />} />
      </div>

      <div className="overflow-x-auto border border-white/10 rounded-2xl bg-[#0a0a0a]">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-5 font-semibold">Student</th>
              <th className="p-5 font-semibold">Course Purchased</th>
              <th className="p-5 font-semibold">Amount</th>
              <th className="p-5 font-semibold">Transaction Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
                <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-500 animate-pulse">Loading transaction logs...</td>
                </tr>
            ) : transactions.length === 0 ? (
                <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-500 italic">No transactions recorded yet.</td>
                </tr>
            ) : transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-5">
                  <div className="font-bold text-white">{tx.userName}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">{tx.userEmail}</div>
                </td>
                <td className="p-5">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                             <Book size={14} />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-300">{tx.courseName}</div>
                            <div className="text-[10px] text-gray-600 uppercase tracking-tighter">{tx.courseId}</div>
                        </div>
                    </div>
                </td>
                <td className="p-5">
                    <div className="font-bold text-green-500 flex items-center gap-1">
                        <IndianRupee size={14} />
                        {tx.amount.toLocaleString()}
                    </div>
                </td>
                <td className="p-5">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={14} />
                        {new Date(tx.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function StatMiniCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all flex items-center justify-between">
            <div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{title}</div>
                <div className="text-xl font-bold mt-1">{value}</div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                {icon}
            </div>
        </div>
    )
}

export default RevenuePage;
