'use client';
import { Check, Plus } from 'lucide-react';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
export function DataTableFacetedFilter(_a) {
    var column = _a.column, title = _a.title, options = _a.options;
    var facets = column === null || column === void 0 ? void 0 : column.getFacetedUniqueValues();
    var selectedValues = new Set(column === null || column === void 0 ? void 0 : column.getFilterValue());
    return (<Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Plus className="mr-2 h-4 w-4"/>
          {title}
          {(selectedValues === null || selectedValues === void 0 ? void 0 : selectedValues.size) > 0 && (<>
              <Separator orientation="vertical" className="mx-2 h-4"/>
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (<Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>) : (options
                .filter(function (option) { return selectedValues.has(option.value); })
                .map(function (option) { return (<Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                        {option.label}
                      </Badge>); }))}
              </div>
            </>)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title}/>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(function (option) {
            var isSelected = selectedValues.has(option.value);
            return (<CommandItem key={option.value} onSelect={function () {
                    if (isSelected) {
                        selectedValues.delete(option.value);
                    }
                    else {
                        selectedValues.add(option.value);
                    }
                    var filterValues = Array.from(selectedValues);
                    column === null || column === void 0 ? void 0 : column.setFilterValue(filterValues.length ? filterValues : undefined);
                }}>
                    <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible')}>
                      <Check className={cn('h-4 w-4')}/>
                    </div>
                    {option.icon && (<option.icon className="mr-2 h-4 w-4 text-muted-foreground"/>)}
                    <span>{option.label}</span>
                    {(facets === null || facets === void 0 ? void 0 : facets.get(option.value)) && (<span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>)}
                  </CommandItem>);
        })}
            </CommandGroup>
            {selectedValues.size > 0 && (<>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={function () { return column === null || column === void 0 ? void 0 : column.setFilterValue(undefined); }} className="justify-center text-center">
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>)}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>);
}
