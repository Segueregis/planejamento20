import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ServiceOrder } from '@/types';
import { format, isSameDay } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ServiceOrderCalendarProps {
  serviceOrders: ServiceOrder[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const ServiceOrderCalendar: React.FC<ServiceOrderCalendarProps> = ({
  serviceOrders,
  selectedDate,
  onDateSelect
}) => {
  // Get count of service orders for a specific date
  const getOrdersCountForDate = (date: Date) => {
    return serviceOrders.filter(order => {
      if (!order.scheduledDate) return false;
      const orderDate = new Date(order.scheduledDate.split('/').reverse().join('-'));
      return isSameDay(orderDate, date);
    }).length;
  };

  // Custom day content to show order count
  const dayContent = (date: Date) => {
    const count = getOrdersCountForDate(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={cn(
          "text-sm",
          isSelected && "font-semibold"
        )}>
          {date.getDate()}
        </span>
        {count > 0 && (
          <div className={cn(
            "absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold",
            isSelected ? "bg-primary-foreground text-primary" : "bg-primary"
          )}>
            {count}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Calendário de OS</CardTitle>
        <p className="text-sm text-muted-foreground">
          Clique em uma data para filtrar as ordens de serviço
        </p>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md border w-full"
          components={{
            Day: ({ date, ...props }) => (
              <div {...props} className={cn(
                "relative p-2 h-12 w-12 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
                selectedDate && isSameDay(date, selectedDate) && "bg-primary text-primary-foreground"
              )}>
                {dayContent(date)}
              </div>
            )
          }}
          locale={pt}
        />
        
        {selectedDate && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Data selecionada:</p>
            <p className="text-sm text-muted-foreground">
              {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: pt })}
            </p>
            <p className="text-sm text-muted-foreground">
              {getOrdersCountForDate(selectedDate)} OS programadas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceOrderCalendar;