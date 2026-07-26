import dynamic from 'next/dynamic';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

export const metadata = {
  title: 'MCP Access',
  description: 'Connect ccreward to Claude Code and other MCP clients. Generate an API key and use reward calculations right from your workflow.',
  alternates: {
    canonical: 'https://ccreward.app/mcp',
  },
  openGraph: {
    title: 'MCP Access | ccreward',
    description: 'Connect ccreward to Claude Code and other MCP clients.',
    url: 'https://ccreward.app/mcp',
  },
  twitter: {
    title: 'MCP Access | ccreward',
    description: 'Connect ccreward to Claude Code and other MCP clients.',
  },
};

const McpPage = dynamic(() => import('@/features/mcp/components/McpPage'));

export default function Mcp() {
  return (
    <PerformanceWrapper name="mcp_page">
      <McpPage />
    </PerformanceWrapper>
  );
}
