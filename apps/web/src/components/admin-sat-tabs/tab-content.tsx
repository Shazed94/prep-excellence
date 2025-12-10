
import { useState, useCallback } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "./data-table"
import { ItemDialog } from "./item-dialog"
import { DeleteDialog } from "./delete-dialog"
import { useTabData } from "./use-tab-data"
import { BaseItem, TabType } from "./lib-data/types"


interface TabContentProps {
  tabType: TabType
  tabLabel: string
}

export function TabContent({ tabType, tabLabel }: TabContentProps) {
  const { data, createItem, updateItem, deleteItem, reorderItems } = useTabData<BaseItem>(tabType)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BaseItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<BaseItem | null>(null)

  const handleCreate = useCallback(
    (itemData: Partial<BaseItem>) => {
      createItem({
        ...itemData,
        order: data.length + 1,
      } as Omit<BaseItem, "id" | "createdAt" | "updatedAt">)
      setIsCreateDialogOpen(false)
    },
    [createItem, data.length],
  )

  const handleEdit = useCallback(
    (itemData: Partial<BaseItem>) => {
      if (editingItem) {
        updateItem(editingItem.id, itemData)
        setEditingItem(null)
      }
    },
    [editingItem, updateItem],
  )

  const handleDelete = useCallback(() => {
    if (deletingItem) {
      deleteItem(deletingItem.id)
      setDeletingItem(null)
    }
  }, [deletingItem, deleteItem])

  const handleCreateDialogChange = useCallback((open: boolean) => {
    setIsCreateDialogOpen(open)
  }, [])

  const handleEditDialogChange = useCallback((open: boolean) => {
    if (!open) {
      setEditingItem(null)
    }
  }, [])

  const handleDeleteDialogChange = useCallback((open: boolean) => {
    if (!open) {
      setDeletingItem(null)
    }
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header Section with Stats */}
      <div className="bg-gradient-to-r from-card via-card to-card/50 border border-border/50 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">{tabLabel}</h2>
              <span className="inline-flex items-center rounded-full bg-primary-dark/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                {data.length} {data.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              {/* <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg> */}
              Manage your {tabLabel.toLowerCase()} items. Drag rows to reorder.
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Create {tabLabel}
          </Button>
        </div>
      </div>

      <DataTable data={data} onEdit={setEditingItem} onDelete={setDeletingItem} onReorder={reorderItems} />

      <ItemDialog
        open={isCreateDialogOpen}
        onOpenChange={handleCreateDialogChange}
        item={null}
        tabType={tabType}
        tabLabel={tabLabel}
        onSave={handleCreate}
      />

      <ItemDialog
        open={!!editingItem}
        onOpenChange={handleEditDialogChange}
        item={editingItem}
        tabType={tabType}
        tabLabel={tabLabel}
        onSave={handleEdit}
      />

      <DeleteDialog
        open={!!deletingItem}
        onOpenChange={handleDeleteDialogChange}
        item={deletingItem}
        tabLabel={tabLabel}
        onConfirm={handleDelete}
      />
    </div>
  )
}
