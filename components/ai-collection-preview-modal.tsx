"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getObjectsForRecommendation, type AIRecommendation } from "@/lib/ai-recommendations";
import { applyHighValueAssetsFilter } from "@/lib/collection-filters";
import { MOCK_CATALOG_ITEMS } from "@/lib/mock-data";
import { Building2, Home, Car, Plane, Ship, Diamond, Eye, EyeOff, Sparkles, Zap, Plus, Trash2, RotateCcw, X, ChevronDown, ChevronUp, Edit2, Check } from "lucide-react";

interface AICollectionPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendation: AIRecommendation;
  onCreateCollection: (collectionData: {
    name: string;
    description: string;
    objectIds: string[];
  }) => void;
}

export function AICollectionPreviewModal({
  open,
  onOpenChange,
  recommendation,
  onCreateCollection,
}: AICollectionPreviewModalProps) {
  const [collectionName, setCollectionName] = useState(recommendation.name);
  const [collectionDescription, setCollectionDescription] = useState(
    `Collection created based on AI analysis: "💎 High-value assets". This collection will automatically include objects that match the defined filtering criteria.`
  );
  const [filterValue, setFilterValue] = useState("💎 High-value assets");
  const [selectedObjects, setSelectedObjects] = useState<Set<string>>(new Set());
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [rules, setRules] = useState([
    {
      field: 'value',
      operator: 'greater_than',
      value: '1000000',
      display: 'Value > $1M'
    },
    {
      field: 'category',
      operator: 'in',
      values: ['Properties', 'Vehicles', 'Aviation', 'Maritime'],
      display: 'Premium categories'
    },
    {
      field: 'status',
      operator: 'in',
      values: ['Available', 'Active', 'Maintenance'],
      display: 'Active status'
    },
    {
      field: 'rating',
      operator: 'greater_than_or_equal',
      value: '4',
      display: 'Rating ≥ 4'
    }
  ]);

  // Use proper filtering logic
  const filteredObjects = applyHighValueAssetsFilter(MOCK_CATALOG_ITEMS);
  console.log('🔍 Debug - Total catalog items:', MOCK_CATALOG_ITEMS.length);
  console.log('🔍 Debug - Filtered objects:', filteredObjects.length);
  console.log('🔍 Debug - Filtered IDs:', filteredObjects.map(obj => obj.id));
  const displayObjects = filteredObjects.slice(0, 4); // Show first 4 items in preview

  const handleCreateCollection = () => {
    const collectionData = {
      name: collectionName,
      description: collectionDescription,
      objectIds: filteredObjects.map(obj => obj.id),
    };
    
    onCreateCollection(collectionData);
    onOpenChange(false);
    
    // Redirect to the new collection page
    // This will be handled by the parent component
  };

  const addNewRule = () => {
    setRules([...rules, {
      field: '',
      operator: '',
      value: '',
      display: 'New rule'
    }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: string, value: any) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "Legal entities": <Building2 className="h-4 w-4 text-blue-600" />,
      "Properties": <Home className="h-4 w-4 text-green-600" />,
      "Vehicles": <Car className="h-4 w-4 text-red-600" />,
      "Aviation": <Plane className="h-4 w-4 text-sky-600" />,
      "Maritime": <Ship className="h-4 w-4 text-blue-500" />,
      "Real Estate": <Home className="h-4 w-4 text-green-600" />,
    };
    return iconMap[category] || <Diamond className="h-4 w-4 text-gray-500" />;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentObjects = isTableExpanded ? filteredObjects : displayObjects;
      setSelectedObjects(new Set(currentObjects.map(obj => obj.id)));
    } else {
      setSelectedObjects(new Set());
    }
  };

  const handleSelectObject = (objectId: string, checked: boolean) => {
    const newSelected = new Set(selectedObjects);
    if (checked) {
      newSelected.add(objectId);
    } else {
      newSelected.delete(objectId);
    }
    setSelectedObjects(newSelected);
  };

  const currentObjects = isTableExpanded ? filteredObjects : displayObjects;
  const allSelected = currentObjects.length > 0 && selectedObjects.size === currentObjects.length;
  const indeterminate = selectedObjects.size > 0 && selectedObjects.size < currentObjects.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] sm:max-w-[1172px] max-h-[95vh] w-[98vw] p-0 flex flex-col [&>button]:hidden">
        <DialogHeader className="flex-shrink-0 px-8 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 shadow-sm">
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">Collection</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground -mt-1">
                  AI generates filtering rules, you review and customize them
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex min-h-0 border-t border-gray-200 -mt-2">
          {/* Left Panel - Collection Builder */}
          <div className="flex-[0_0_800px] flex flex-col min-h-0 border-r border-gray-200">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 min-h-0 overflow-auto p-4">
                <div className="space-y-4">
                  {/* Collection Details */}
                  <div className="space-y-3">
                    <div>
                      <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium">
                        Name
                      </label>
                      <Input
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        className="mt-1"
                        placeholder="Enter collection name..."
                      />
                    </div>
                    <div>
                      <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium">
                        Description
                      </label>
                      <Textarea
                        value={collectionDescription}
                        onChange={(e) => setCollectionDescription(e.target.value)}
                        className="mt-1 resize-none"
                        placeholder="Enter collection description..."
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Filter Criteria */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Filter criteria</span>
                      
                      {!isEditingRules ? (
                        <button 
                          onClick={() => setIsEditingRules(true)}
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Customize filters
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setIsEditingRules(false)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => {
                              // Save logic
                              setIsEditingRules(false);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Save changes
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Правила */}
                    {!isEditingRules ? (
                      // Режим перегляду - компактні теги
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm">
                          💰 Value &gt; $1M
                        </span>
                        <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm">
                          🏢 Premium categories
                        </span>
                        <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-sm">
                          ✅ Active status
                        </span>
                        <span className="px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full text-sm">
                          ⭐ Rating ≥ 4
                        </span>
                      </div>
                    ) : (
                      // Режим редагування - повні контроли
                      <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-3">Define rules and conditions to automatically populate items</p>
                        
                        {/* Існуючі правила */}
                        <div className="space-y-2">
                          {rules.map((rule, index) => (
                            <div key={index} className="flex items-center gap-2">
                              {/* Field Select */}
                              <select 
                                className="w-32 px-3 py-2 border rounded-md text-sm"
                                value={rule.field}
                                onChange={(e) => updateRule(index, 'field', e.target.value)}
                              >
                                <option value="">Select field...</option>
                                <option value="value">Value</option>
                                <option value="category">Category</option>
                                <option value="status">Status</option>
                                <option value="location">Location</option>
                                <option value="rating">Rating</option>
                              </select>
                              
                              {/* Operator Select */}
                              <select 
                                className="w-40 px-3 py-2 border rounded-md text-sm"
                                value={rule.operator}
                                onChange={(e) => updateRule(index, 'operator', e.target.value)}
                                disabled={!rule.field}
                              >
                                <option value="">Select operator...</option>
                                {rule.field === 'value' || rule.field === 'rating' ? (
                                  <>
                                    <option value="greater_than">Greater than</option>
                                    <option value="greater_than_or_equal">Greater than or equal</option>
                                    <option value="less_than">Less than</option>
                                    <option value="less_than_or_equal">Less than or equal</option>
                                    <option value="equals">Equals</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="in">Is any of</option>
                                    <option value="not_in">Is not any of</option>
                                    <option value="contains">Contains</option>
                                    <option value="not_contains">Does not contain</option>
                                  </>
                                )}
                              </select>
                              
                              {/* Value Input */}
                              <input 
                                type={rule.field === 'rating' ? 'number' : 'text'}
                                value={rule.field === 'value' || rule.field === 'rating' ? rule.value : (rule.values ? rule.values.join(', ') : '')}
                                onChange={(e) => {
                                  if (rule.field === 'value' || rule.field === 'rating') {
                                    updateRule(index, 'value', e.target.value);
                                  } else {
                                    updateRule(index, 'values', e.target.value.split(', '));
                                  }
                                }}
                                placeholder={
                                  rule.field === 'rating' ? '4' : 
                                  rule.field === 'value' ? '$1,000,000' : 
                                  'Enter values separated by comma'
                                }
                                className="flex-1 px-3 py-2 border rounded-md text-sm"
                                min={rule.field === 'rating' ? '1' : undefined}
                                max={rule.field === 'rating' ? '5' : undefined}
                              />
                              
                              {/* Delete Button */}
                              <button 
                                onClick={() => removeRule(index)}
                                className="p-2 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Кнопка додавання нового правила */}
                        <button 
                          onClick={addNewRule}
                          className="mt-3 flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add rule
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Items to be added to collection */}
                  <div className="space-y-3">
                    <span className="text-sm font-medium text-gray-700">Items to be added to collection:</span>
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600 font-medium">{filteredObjects.length} items match</span>
                        </div>
                        <button
                          onClick={() => setIsTableExpanded(!isTableExpanded)}
                          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
                        >
                          {isTableExpanded ? (
                            <>
                              <ChevronUp className="w-3 h-3" />
                              Collapse
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3" />
                              Expand
                            </>
                          )}
                        </button>
                      </div>
                    {isTableExpanded && (
                      <div className="mt-4">
                        <div className="rounded-lg border border-border bg-card max-h-64 overflow-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={indeterminate ? "indeterminate" : allSelected}
                                onCheckedChange={handleSelectAll}
                              />
                            </TableHead>
                            <TableHead className="cursor-pointer select-none hover:bg-muted/50">
                              <div className="flex items-center">
                                Name
                                <span className="ml-1">↑</span>
                              </div>
                            </TableHead>
                            <TableHead>ID Code</TableHead>
                            <TableHead className="cursor-pointer select-none hover:bg-muted/50">
                              <div className="flex items-center">Category</div>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="cursor-pointer select-none hover:bg-gray-50">
                              <div className="flex items-center">Value</div>
                            </TableHead>
                            <TableHead className="cursor-pointer select-none hover:bg-gray-50">
                              <div className="flex items-center">Rating</div>
                            </TableHead>
                            <TableHead>People</TableHead>
                            <TableHead className="cursor-pointer select-none hover:bg-gray-50">
                              <div className="flex items-center">Updated</div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(isTableExpanded ? filteredObjects : displayObjects).map((object) => (
                            <TableRow key={object.id} className="group cursor-pointer">
                              <TableCell>
                                <Checkbox
                                  checked={selectedObjects.has(object.id)}
                                  onCheckedChange={(checked) => handleSelectObject(object.id, checked as boolean)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                    {getCategoryIcon(object.category)}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm group-hover:text-blue-600 transition-colors">
                                      {object.name}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700 border-blue-200">
                                  {object.idCode || object.id}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                                  {object.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  {object.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm font-medium">
                                  {object.value ? `$${(object.value / 1000000).toFixed(1)}M` : '—'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">⭐</span>
                                  <span className="text-sm">{object.guestRating || '—'}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex -space-x-1">
                                  {object.people && object.people.slice(0, 2).map((person, i) => (
                                    <div
                                      key={i}
                                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-gray-100 text-xs font-medium text-gray-700"
                                      title={`${person.role}: ${person.name}`}
                                    >
                                      {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                  ))}
                                  {object.people && object.people.length > 2 && (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                                      +{object.people.length - 2}
                                    </div>
                                  )}
                                  {(!object.people || object.people.length === 0) && (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs text-muted-foreground">
                                  {object.lastUpdated ? new Date(object.lastUpdated).toLocaleDateString() : '—'}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-200">
              <div className="flex justify-between items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="text-gray-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCollection}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Create Collection
                    <Badge className="ml-2 bg-white/20 text-white border-white/30">
                      {filteredObjects.length} items
                    </Badge>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - AI Assistant */}
          <div className="flex-1 bg-gray-50 flex flex-col">
            <div className="flex-shrink-0 flex items-center gap-2 p-4 border-b border-gray-200 bg-white">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="font-medium text-gray-900">AI Assistant</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-1 h-6 w-6"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-auto p-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-lg px-3 py-2 bg-blue-600 text-white">
                        <p className="text-sm leading-relaxed">💎 High-value assets</p>
                        <p className="text-xs mt-1 text-blue-100">13:46</p>
                      </div>
                    </div>
                    <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
                      <div className="max-w-[80%] rounded-lg px-3 py-2 bg-gray-100 text-gray-900">
                        <p className="text-sm leading-relaxed">
                          I've analyzed your request "💎 High-value assets" and created this custom collection based on your specific criteria. The items have been intelligently grouped to meet your needs.
                        </p>
                        <p className="text-xs mt-1 text-gray-500">13:46</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
              <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      placeholder="Ask me anything..."
                      className="w-full px-4 py-3 pr-20 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="text"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-gray-100">
                        <Plus className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-gray-100" disabled>
                        <span className="h-4 w-4 text-gray-500">→</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
