interface BaseNode {
  type: string;
  loc: SourceLocation;
}

interface ProgramNode extends BaseNode {
  type: 'Program';
  metadata: MetadataNode;
  imports: ImportNode[];
  rules: RuleNode[];
  functions: FunctionNode[];
}

interface MetadataNode extends BaseNode {
  type: 'Metadata';
  name: string;
  context: string[];
  version?: string;
  author?: string;
  dependencies?: string[];
}

interface ImportNode extends BaseNode {
  type: 'Import';
  module: string;
  alias?: string;
  from: string;
}

interface RuleNode extends BaseNode {
  type: 'Rule';
  label: string;
  conditions: ConditionBlockNode;
  actions: ActionBlockNode;
  outcome: OutcomeBlockNode;
  locals: Map<string, any>; // Rule-local variables
}

interface ConditionBlockNode extends BaseNode {
  type: 'ConditionBlock';
  conditions: ConditionNode[];
  logicalOperator?: 'and' | 'or';
}

interface ConditionNode extends BaseNode {
  type: 'Condition';
  expression: ExpressionNode;
  negated: boolean;
}

interface ExpressionNode extends BaseNode {
  type: 'Expression';
  left: OperandNode;
  operator: OperatorNode;
  right: OperandNode;
}

interface OperandNode extends BaseNode {
  type: 'Operand';
  value: PathNode | LiteralNode | FunctionCallNode;
}

interface ActionBlockNode extends BaseNode {
  type: 'ActionBlock';
  actions: ActionNode[];
  isAsync: boolean;
  isParallel: boolean;
}

interface ActionNode extends BaseNode {
  type: 'Action';
  actionType: 'assignment' | 'function_call' | 'control_flow' | 'loop';
  expression: AssignmentNode | FunctionCallNode | ControlFlowNode | LoopNode;
}

interface AssignmentNode extends BaseNode {
  type: 'Assignment';
  target: PathNode;
  value: ValueNode;
}

interface FunctionCallNode extends BaseNode {
  type: 'FunctionCall';
  name: string;
  arguments: ArgumentNode[];
  isAsync: boolean;
  await: boolean;
}

interface ControlFlowNode extends BaseNode {
  type: 'ControlFlow';
  condition: ExpressionNode;
  thenBlock: ActionBlockNode;
  elseBlock?: ActionBlockNode;
}

interface LoopNode extends BaseNode {
  type: 'Loop';
  loopType: 'for_each' | 'repeat';
  iterator?: string;
  collection?: PathNode;
  count?: number;
  body: ActionBlockNode;
}

interface OutcomeBlockNode extends BaseNode {
  type: 'OutcomeBlock';
  statements: OutcomeStatementNode[];
}

interface OutcomeStatementNode extends BaseNode {
  type: 'OutcomeStatement';
  returnValue?: ValueNode;
  action: 'stop' | 'continue' | 'wait';
  waitDuration?: number;
}

interface FunctionNode extends BaseNode {
  type: 'Function';
  name: string;
  parameters: ParameterNode[];
  returnType: string;
  inputs: InputDeclarationNode[];
  steps: ActionBlockNode;
}

// Value Nodes
interface LiteralNode extends BaseNode {
  type: 'Literal';
  valueType: 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';
  value: any;
}

interface PathNode extends BaseNode {
  type: 'Path';
  parts: string[];
  isRooted: boolean; // e.g., $request vs localVar
}

interface TemplateLiteralNode extends BaseNode {
  type: 'TemplateLiteral';
  parts: (string | InterpolationNode)[];
}

interface InterpolationNode extends BaseNode {
  type: 'Interpolation';
  expression: PathNode;
}

// Async & Parallel Nodes
interface AsyncBlockNode extends BaseNode {
  type: 'AsyncBlock';
  body: ActionBlockNode;
  awaitAll: boolean;
}

interface ParallelBlockNode extends BaseNode {
  type: 'ParallelBlock';
  items: ActionNode[];
}

// Error Handling Nodes
interface TryCatchNode extends BaseNode {
  type: 'TryCatch';
  tryBlock: ActionBlockNode;
  catchVariable: string;
  catchBlock: ActionBlockNode;
}