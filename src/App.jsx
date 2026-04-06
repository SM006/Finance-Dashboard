import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus, Search, Wallet, TrendingUp, TrendingDown,
  Settings, CreditCard, ChevronRight, X, Trash2, Edit2, Activity, PieChart as PieIcon,
  Sun, Moon,
  Briefcase, Laptop, Zap, Cloud, Users, Coffee, Car, Receipt
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, YAxis,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';

import './index.css';

const initialTransactions = [
  { id: '1', date: '2026-04-05', amount: 3200.00, category: 'Payroll', type: 'income', title: 'Zorvyn Corp' },
  { id: '2', date: '2026-04-04', amount: 420.50, category: 'Hardware', type: 'expense', title: 'Apple Store' },
  { id: '3', date: '2026-04-03', amount: 45.00, category: 'Software', type: 'expense', title: 'Figma Pro' },
  { id: '4', date: '2026-04-02', amount: 85.00, category: 'Utilities', type: 'expense', title: 'AWS Cloud' },
  { id: '5', date: '2026-04-01', amount: 450.00, category: 'Consulting', type: 'income', title: 'Acme Corp' },
  { id: '6', date: '2026-03-28', amount: 120.00, category: 'Dining', type: 'expense', title: 'Sushi Nakazawa' },
  { id: '7', date: '2026-03-25', amount: 15.00, category: 'Transport', type: 'expense', title: 'UberX' }
];

const balanceData = [
  { name: 'Nov', balance: 3200 },
  { name: 'Dec', balance: 3500 },
  { name: 'Jan', balance: 3100 },
  { name: 'Feb', balance: 4200 },
  { name: 'Mar', balance: 4800 },
  { name: 'Apr', balance: 7500 },
  { name: 'May', balance: 7100 },
];

const iconMap = {
  Payroll: <Briefcase size={20} />,
  Hardware: <Laptop size={20} />,
  Software: <Zap size={20} />,
  Utilities: <Cloud size={20} />,
  Consulting: <Users size={20} />,
  Dining: <Coffee size={20} />,
  Transport: <Car size={20} />
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bento-bg)', border: '1px solid var(--glass-border)', padding: '12px 16px', borderRadius: '16px', backdropFilter: 'blur(10px)', color: 'var(--text-primary)' }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '16px' }}>${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function App() {
  const [role, setRole] = useState('viewer');
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const { balance, totalIncome, totalExpense } = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      if (tx.type === 'income') {
        acc.totalIncome += tx.amount;
        acc.balance += tx.amount;
      } else {
        acc.totalExpense += tx.amount;
        acc.balance -= tx.amount;
      }
      return acc;
    }, { balance: 0, totalIncome: 0, totalExpense: 0 });
  }, [transactions]);

  const topCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = {};
    expenses.forEach(t => grouped[t.category] = (grouped[t.category] || 0) + t.amount);
    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    return sorted.length ? sorted[0][0] : 'None';
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] }));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) || tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === 'all' || tx.type === filterType;
      return matchSearch && matchType;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, searchQuery, filterType]);

  const openModal = (tx = null) => {
    if (role !== 'admin') return;
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTx = {
      id: editingTx ? editingTx.id : Date.now().toString(),
      title: formData.get('title'),
      amount: parseFloat(formData.get('amount')),
      category: formData.get('category'),
      date: formData.get('date'),
      type: formData.get('type')
    };

    if (editingTx) {
      setTransactions(prev => prev.map(t => t.id === editingTx.id ? newTx : t));
    } else {
      setTransactions(prev => [newTx, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (role !== 'admin') return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      <div className="ambient-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="app-ecosystem">
        {/* Dock Navigation */}
        <div className="glass-dock">
          <div className="dock-item" style={{ cursor: 'default', opacity: 1, gap: '8px' }}>
            <div style={{ background: 'var(--accent)', borderRadius: '8px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
              <Wallet size={16} color="var(--text-primary)" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '1px' }}>ZORVYN</span>
          </div>
          <div className="dock-divider" />
          <div className={`dock-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Activity size={16} /> Dashboard
          </div>
          <div className={`dock-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
            <Receipt size={16} /> Transactions
          </div>
          <div className="dock-divider" />
          <div 
            className="dock-item" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </div>
          <div className="dock-divider" />
          {/* Spatial Role Toggle */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '40px', padding: 4 }}>
            <div
              className={`dock-item ${role === 'viewer' ? 'active' : ''}`}
              onClick={() => setRole('viewer')}
              style={{ padding: '6px 16px', background: role === 'viewer' ? 'white' : 'transparent', color: role === 'viewer' ? 'black' : 'white' }}
            >Viewer</div>
            <div
              className={`dock-item ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
              style={{ padding: '6px 16px', background: role === 'admin' ? 'white' : 'transparent', color: role === 'admin' ? 'black' : 'white' }}
            >Admin</div>
          </div>
        </div>

        {/* Spatial Bento Grid */}
        <div className="bento-container">

          {/* Dashboard specific views */}
          {activeTab === 'dashboard' && (
            <>
              {/* Main Balance Box */}
              <div className="bento-box box-balance">
            <span className="balance-label">Total Balance</span>
            <div className="balance-value">
              <span className="balance-currency">$</span>
              {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div className="balance-actions">
              {role === 'admin' && (
                <button className="glass-btn primary" onClick={() => openModal()}>
                  <Plus size={16} /> New
                </button>
              )}
              <button className="glass-btn" onClick={() => setIsSettingsOpen(true)}>
                <Settings size={16} /> Manage
              </button>
            </div>
          </div>

          {/* Insights Pills */}
          <div className="bento-box box-insights">
            <div className="insights-row">
              <div className="insight-pill">
                <div className="ip-icon"><TrendingUp size={20} /></div>
                <div className="ip-label">Total Income</div>
                <div className="ip-value">${totalIncome.toLocaleString()}</div>
              </div>
              <div className="insight-pill" style={{ background: 'rgba(255, 77, 77, 0.1)', borderColor: 'rgba(255, 77, 77, 0.2)' }}>
                <div className="ip-icon" style={{ background: 'var(--danger)' }}><TrendingDown size={20} /></div>
                <div className="ip-label">Total Expenses</div>
                <div className="ip-value">${totalExpense.toLocaleString()}</div>
              </div>
              <div className="insight-pill" style={{ background: 'rgba(51, 204, 255, 0.1)', borderColor: 'rgba(51, 204, 255, 0.2)' }}>
                <div className="ip-icon" style={{ background: 'var(--accent-orb-2)' }}><PieIcon size={20} /></div>
                <div className="ip-label">Highest Spend</div>
                <div className="ip-value">{topCategory}</div>
              </div>
            </div>
          </div>

          {/* Abstract Chart */}
          <div className="bento-box box-chart">
            <div className="chart-header">
              <h3>Balance Trend</h3>
              <div className="glass-btn" style={{ padding: '6px 12px', fontSize: 12 }}>YTD</div>
            </div>
            <div className="chart-canvas">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTrajectory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-stroke)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--chart-stroke)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--glass-border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="balance" stroke="var(--chart-stroke)" strokeWidth={3} fillOpacity={1} fill="url(#colorTrajectory)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bento-box box-pie">
            <div className="chart-header" style={{ position: 'relative', padding: '0 0 16px 0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Spending Breakdown</h3>
            </div>
            <div style={{ flex: 1, minHeight: '200px' }}>
              {expenseByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie 
                      data={expenseByCategory} 
                      innerRadius={45} 
                      outerRadius={75} 
                      paddingAngle={3} 
                      dataKey="value" 
                      stroke="none" 
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, name }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius * 1.35;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text x={x} y={y} fill="var(--text-primary)" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight={600}>
                            {name}
                          </text>
                        );
                      }}
                      labelLine={false}
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  </RePieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>No expenses</div>
              )}
            </div>
          </div>
          </>
          )}

          {/* Transactions List */}
          {activeTab === 'transactions' && (
          <div className="bento-box box-transactions">
            <div className="tx-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Transactions</h3>
                <Search size={16} color="var(--text-muted)" />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="input-field" 
                  style={{ padding: '8px 12px', margin: 0, flex: 1 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select 
                  className="input-field" 
                  style={{ padding: '8px 12px', margin: 0, width: 'auto', appearance: 'none' }}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>
            <div className="tx-list">
              {filteredTransactions.map(tx => (
                <div className="tx-card" key={tx.id} onClick={() => role === 'admin' ? openModal(tx) : null} style={{ cursor: role === 'admin' ? 'pointer' : 'default' }}>
                  <div className="tx-lhs">
                    <div className="tx-icon">{iconMap[tx.category] || <Receipt size={20} />}</div>
                    <div className="tx-info">
                      <h4>{tx.title}</h4>
                      <p>{tx.date} • {tx.category}</p>
                    </div>
                  </div>
                  <div className="tx-rhs">
                    <div className={`tx-amt ${tx.type === 'income' ? 'pos' : ''}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                    {role === 'admin' && (
                      <div className="tx-actions-inline">
                        <button className="action-btn" onClick={(e) => handleDelete(tx.id, e)}><Trash2 size={14} /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

        </div>
      </div>

      {/* Spatial Modal */}
      {isModalOpen && (
        <div className="portal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="portal-box" onClick={e => e.stopPropagation()}>
            <div className="portal-header">
              <h2>{editingTx ? 'Edit Transaction' : 'New Transaction'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <input required name="title" placeholder="Title" className="input-field" defaultValue={editingTx?.title || ''} />

              <div className="input-row">
                <input required type="number" step="0.01" name="amount" placeholder="Amount ($)" className="input-field" defaultValue={editingTx?.amount || ''} />
                <input required name="category" placeholder="Category" className="input-field" defaultValue={editingTx?.category || ''} />
              </div>

              <div className="input-row">
                <input required type="date" name="date" className="input-field" defaultValue={editingTx?.date || new Date().toISOString().split('T')[0]} />
                <select name="type" className="input-field" style={{ appearance: 'none' }} defaultValue={editingTx?.type || 'expense'}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <button type="submit" className="glass-btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                Save Transaction
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="portal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="portal-box" onClick={e => e.stopPropagation()}>
            <div className="portal-header">
              <h2>Settings</h2>
              <button className="close-btn" onClick={() => setIsSettingsOpen(false)}><X size={20} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Appearance</h4>
                <button 
                  className="glass-btn" 
                  style={{ width: '100%', justifyContent: 'space-between' }}
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  Theme <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>

              <div>
                <h4 style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Simulation Role</h4>
                <div style={{ display: 'flex', background: 'var(--input-bg)', borderRadius: '12px', padding: '4px', border: '1px solid var(--glass-border)' }}>
                  <div
                    onClick={() => setRole('viewer')}
                    style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '8px', background: role === 'viewer' ? 'var(--btn-primary-bg)' : 'transparent', color: role === 'viewer' ? 'var(--btn-primary-text)' : 'var(--text-primary)', cursor: 'pointer', transition: '0.2s', fontSize: '14px', fontWeight: 600 }}
                  >Viewer</div>
                  <div
                    onClick={() => setRole('admin')}
                    style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '8px', background: role === 'admin' ? 'var(--btn-primary-bg)' : 'transparent', color: role === 'admin' ? 'var(--btn-primary-text)' : 'var(--text-primary)', cursor: 'pointer', transition: '0.2s', fontSize: '14px', fontWeight: 600 }}
                  >Admin</div>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Data</h4>
                <button 
                  className="glass-btn" 
                  style={{ width: '100%', color: 'var(--danger)', borderColor: 'rgba(255,0,0,0.2)', justifyContent: 'center' }}
                  onClick={() => { setTransactions(initialTransactions); setIsSettingsOpen(false); }}
                >
                  Reset to Default Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
