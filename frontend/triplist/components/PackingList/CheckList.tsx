'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updatePackingList } from '@/app/actions';
import { addItemToList } from '@/app/actions/packing-list';

interface CheckListProps {
  planId: string;
  initialItems: { label: string; checked: boolean }[];
}

export function CheckList({ planId, initialItems }: CheckListProps) {
  const [items, setItems] = useState(initialItems);
  const [isSaving, setIsSaving] = useState(false);
  const [newItem, setNewItem] = useState("");

  const handleToggle = (index: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], checked: !newItems[index].checked };
    setItems(newItems);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePackingList(planId, items);
      
      toast.success('Changes saved successfully!', {
        description: 'Your packing list has been updated.',
      });
    } catch (error) {
      console.error('Error saving checklist:', error);
      toast.error('Failed to save changes', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      const result = await addItemToList(planId, newItem.trim());
      if (result.success) {
        setItems([...items, { label: newItem.trim(), checked: false }]);
        setNewItem("");
        toast.success('Item added successfully!');
      }
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Packing List</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      <form onSubmit={handleAddItem} className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Add a new item to your packing list..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="w-full pl-4 pr-24 h-11 bg-muted/50 border-dashed"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-muted"
          >
            Add Item
          </Button>
        </div>
      </form>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
            <Label className="text-lg">{item.label}</Label>
            <Switch
              checked={item.checked}
              onCheckedChange={() => handleToggle(idx)}
              id={`item-${idx}`}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
