import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';

const StatCard = ({
                      title,
                      value,
                      icon: Icon,
                      trend = null,
                      trendLabel = '',
                      color = 'blue',
                      loading = false
                  }) => {
    const colors = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600' },
        green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-600' },
        yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'text-yellow-600' },
        red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-600' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-600' },
        pink: { bg: 'bg-pink-50', text: 'text-pink-600', icon: 'text-pink-600' }
    };

    const theme = colors[color];

    if (loading) {
        return (
            <Card className="p-6 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-3 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>

                    {trend !== null && (
                        <div className={`mt-2 flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend >= 0 ? (
                                <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                                <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            <span className="font-medium">{trend > 0 ? '+' : ''}{trend}%</span>
                            {trendLabel && <span className="ml-1 text-gray-500">{trendLabel}</span>}
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-xl ${theme.bg} flex-shrink-0 ml-4`}>
                    <Icon className={`w-6 h-6 ${theme.icon}`} />
                </div>
            </div>
        </Card>
    );
};

export default StatCard;