import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Users, Clock, Eye, TrendingUp, Smartphone, Monitor } from "lucide-react";

type AnalyticsData = {
  totalVisits: number;
  uniqueSessions: number;
  avgTimeOnSite: number;
  avgScrollDepth: number;
  topPages: Array<{ page: string; views: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  browserBreakdown: Array<{ browser: string; count: number }>;
  recentVisits: Array<{
    page_path: string;
    page_title: string;
    created_at: string;
    time_on_page: number;
    device_type: string;
  }>;
};

type TimeRange = '24h' | '7d' | '30d' | '90d';

export function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    uniqueSessions: 0,
    avgTimeOnSite: 0,
    avgScrollDepth: 0,
    topPages: [],
    deviceBreakdown: [],
    browserBreakdown: [],
    recentVisits: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const getTimeRangeFilter = () => {
    const now = new Date();
    switch (timeRange) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const timeFilter = getTimeRangeFilter();

      // Fetch all analytics data for the time range
      const { data: analyticsData, error } = await supabase
        .from('page_analytics')
        .select('*')
        .gte('created_at', timeFilter)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (analyticsData) {
        // Calculate metrics
        const totalVisits = analyticsData.length;
        const uniqueSessions = new Set(analyticsData.map(d => d.session_id)).size;
        
        const validTimeOnPage = analyticsData.filter(d => d.time_on_page != null && d.time_on_page > 0);
        const avgTimeOnSite = validTimeOnPage.length > 0
          ? Math.round(validTimeOnPage.reduce((sum, d) => sum + (d.time_on_page || 0), 0) / validTimeOnPage.length)
          : 0;

        const validScrollDepth = analyticsData.filter(d => d.scroll_depth != null && d.scroll_depth > 0);
        const avgScrollDepth = validScrollDepth.length > 0
          ? Math.round(validScrollDepth.reduce((sum, d) => sum + (d.scroll_depth || 0), 0) / validScrollDepth.length)
          : 0;

        // Top pages
        const pageViews = analyticsData.reduce((acc: Record<string, number>, d) => {
          acc[d.page_path] = (acc[d.page_path] || 0) + 1;
          return acc;
        }, {});
        const topPages = Object.entries(pageViews)
          .map(([page, views]) => ({ page, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        // Device breakdown
        const deviceCounts = analyticsData.reduce((acc: Record<string, number>, d) => {
          if (d.device_type) {
            acc[d.device_type] = (acc[d.device_type] || 0) + 1;
          }
          return acc;
        }, {});
        const deviceBreakdown = Object.entries(deviceCounts)
          .map(([device, count]) => ({ device, count }))
          .sort((a, b) => b.count - a.count);

        // Browser breakdown
        const browserCounts = analyticsData.reduce((acc: Record<string, number>, d) => {
          if (d.browser) {
            acc[d.browser] = (acc[d.browser] || 0) + 1;
          }
          return acc;
        }, {});
        const browserBreakdown = Object.entries(browserCounts)
          .map(([browser, count]) => ({ browser, count }))
          .sort((a, b) => b.count - a.count);

        // Recent visits (last 10)
        const recentVisits = analyticsData.slice(0, 10);

        setAnalytics({
          totalVisits,
          uniqueSessions,
          avgTimeOnSite,
          avgScrollDepth,
          topPages,
          deviceBreakdown,
          browserBreakdown,
          recentVisits,
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Website Analytics</h3>
        <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
          <SelectTrigger className="w-40 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalVisits.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Unique Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.uniqueSessions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Time on Site
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatTime(analytics.avgTimeOnSite)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Scroll Depth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.avgScrollDepth}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topPages.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No page views yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.topPages.map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate flex-1">{page.page}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(page.views / analytics.topPages[0].views) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-12 text-right">{page.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device & Browser Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Devices & Browsers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Devices
              </h4>
              <div className="space-y-2">
                {analytics.deviceBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{item.device}</span>
                    <span className="font-semibold">
                      {item.count} ({Math.round((item.count / analytics.totalVisits) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3">Browsers</h4>
              <div className="space-y-2">
                {analytics.browserBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span>{item.browser}</span>
                    <span className="font-semibold">
                      {item.count} ({Math.round((item.count / analytics.totalVisits) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentVisits.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent visits</p>
          ) : (
            <div className="space-y-2">
              {analytics.recentVisits.map((visit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex-1">
                    <div className="font-medium">{visit.page_path}</div>
                    <div className="text-sm text-muted-foreground">{visit.page_title || 'Untitled'}</div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="capitalize text-muted-foreground">{visit.device_type}</span>
                    {visit.time_on_page && (
                      <span className="text-muted-foreground">{formatTime(visit.time_on_page)}</span>
                    )}
                    <span className="text-muted-foreground">{formatDate(visit.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
