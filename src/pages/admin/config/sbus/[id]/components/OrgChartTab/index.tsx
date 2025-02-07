import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
} from '@xyflow/react';
import { supabase } from '@/integrations/supabase/client';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronRight, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrgChartProps {
  sbuId: string | undefined;
}

interface UserNode extends Node {
  data: {
    label: string;
    subtitle: string;
    email: string;
    userId: string;
    isExpanded?: boolean;
    hasChildren?: boolean;
  };
}

const nodeDefaults = {
  sourcePosition: 'bottom',
  targetPosition: 'top',
  style: {
    minWidth: '300px',
    padding: '0',
    borderRadius: '8px',
  },
};

const VERTICAL_SPACING = 120;
const HORIZONTAL_SPACING = 350;

export default function OrgChartTab({ sbuId }: OrgChartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const { data: hierarchyData } = useQuery({
    queryKey: ['sbu-hierarchy', sbuId],
    queryFn: async () => {
      if (!sbuId) return null;

      // Fetch SBU head
      const { data: sbuData } = await supabase
        .from('sbus')
        .select(`
          id,
          name,
          head:profiles!sbus_head_id_fkey (
            id,
            first_name,
            last_name,
            email,
            designation
          )
        `)
        .eq('id', sbuId)
        .single();

      if (!sbuData?.head) return null;

      // Fetch all employees and their supervisors in this SBU
      const { data: employeesData } = await supabase
        .from('user_sbus')
        .select(`
          user:profiles!user_sbus_user_id_fkey (
            id,
            first_name,
            last_name,
            email,
            designation,
            supervisors:user_supervisors!user_supervisors_user_id_fkey (
              is_primary,
              supervisor:profiles!user_supervisors_supervisor_id_fkey (
                id,
                first_name,
                last_name,
                email,
                designation
              )
            )
          )
        `)
        .eq('sbu_id', sbuId)
        .eq('is_primary', true);

      return {
        sbu: sbuData,
        employees: employeesData || [],
      };
    },
    enabled: !!sbuId,
  });

  const toggleNodeExpansion = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const processHierarchyData = useCallback(
    (data: typeof hierarchyData) => {
      if (!data) return;

      const newNodes: UserNode[] = [];
      const newEdges: any[] = [];
      const processedNodes = new Set<string>();
      const nodesByManager: { [key: string]: UserNode[] } = {};
      const orphanedNodes: UserNode[] = [];

      // Process all employees first to build the hierarchy map
      const employees = data.employees.map((e) => e.user).filter(Boolean);
      employees.forEach((emp) => {
        const primarySupervisor = emp.supervisors?.find((s) => s.is_primary)?.supervisor;
        const node: UserNode = {
          id: emp.id,
          type: 'userNode',
          position: { x: 0, y: 0 }, // Will be calculated later
          data: {
            label: `${emp.first_name} ${emp.last_name}`,
            subtitle: emp.designation || 'Team Member',
            email: emp.email,
            userId: emp.id,
            isExpanded: expandedNodes.has(emp.id),
            hasChildren: false,
          },
          ...nodeDefaults,
        };

        if (primarySupervisor) {
          if (!nodesByManager[primarySupervisor.id]) {
            nodesByManager[primarySupervisor.id] = [];
          }
          nodesByManager[primarySupervisor.id].push(node);
        } else {
          orphanedNodes.push(node);
        }
      });

      // Add SBU head at the top
      const headNode: UserNode = {
        id: data.sbu.head.id,
        type: 'userNode',
        position: { x: 400, y: 50 },
        data: {
          label: `${data.sbu.head.first_name} ${data.sbu.head.last_name}`,
          subtitle: data.sbu.head.designation || 'SBU Head',
          email: data.sbu.head.email,
          userId: data.sbu.head.id,
          isExpanded: expandedNodes.has(data.sbu.head.id),
          hasChildren: nodesByManager[data.sbu.head.id]?.length > 0,
        },
        ...nodeDefaults,
      };
      newNodes.push(headNode);
      processedNodes.add(data.sbu.head.id);

      // Recursive function to position nodes
      const positionNodes = (
        managerId: string,
        level: number,
        startX: number,
        parentNode: UserNode
      ) => {
        if (!expandedNodes.has(managerId)) return;

        const directReports = nodesByManager[managerId] || [];
        const totalWidth = directReports.length * HORIZONTAL_SPACING;
        let currentX = startX - totalWidth / 2;

        directReports.forEach((node, index) => {
          if (!processedNodes.has(node.id)) {
            node.position = {
              x: currentX + index * HORIZONTAL_SPACING,
              y: level * VERTICAL_SPACING,
            };
            node.data.hasChildren = !!nodesByManager[node.id]?.length;
            newNodes.push(node);
            processedNodes.add(node.id);

            // Add edge from manager to direct report
            newEdges.push({
              id: `${managerId}-${node.id}`,
              source: managerId,
              target: node.id,
              type: 'smoothstep',
              style: { stroke: '#64748b', strokeWidth: 2 },
            });

            if (expandedNodes.has(node.id)) {
              positionNodes(node.id, level + 1, currentX + index * HORIZONTAL_SPACING, node);
            }
          }
        });
      };

      // Position nodes starting from the head
      positionNodes(data.sbu.head.id, 1, 400, headNode);

      // Position orphaned nodes in a separate section
      if (orphanedNodes.length > 0) {
        const orphanedY = Math.max(...newNodes.map((n) => n.position.y)) + VERTICAL_SPACING * 2;
        orphanedNodes.forEach((node, index) => {
          if (!processedNodes.has(node.id)) {
            node.position = {
              x: 400 + (index - Math.floor(orphanedNodes.length / 2)) * HORIZONTAL_SPACING,
              y: orphanedY,
            };
            node.data.hasChildren = !!nodesByManager[node.id]?.length;
            newNodes.push(node);
          }
        });
      }

      setNodes(newNodes);
      setEdges(newEdges);
    },
    [setNodes, setEdges, expandedNodes]
  );

  useEffect(() => {
    if (hierarchyData) {
      processHierarchyData(hierarchyData);
    }
  }, [hierarchyData, processHierarchyData, expandedNodes]);

  const CustomNode = ({ data }: { data: UserNode['data'] }) => {
    return (
      <Card className="w-full">
        <div className="p-4 flex items-start gap-3">
          {data.hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => toggleNodeExpansion(data.userId)}
            >
              {data.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-muted-foreground" />
              <div className="font-medium text-base">{data.label}</div>
            </div>
            <div className="text-sm text-muted-foreground">{data.subtitle}</div>
            <div className="text-xs text-muted-foreground mt-1">{data.email}</div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="h-[600px] border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{
          userNode: CustomNode,
        }}
        fitView
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <MiniMap zoomable pannable />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}