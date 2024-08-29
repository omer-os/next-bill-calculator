"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Shuffle, DollarSign, Users, Menu, Sun, Moon, X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerTrigger } from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface Person {
  name: string;
  amount: number;
}



const languageStrings = {
  en: {
    title: "Bill Splitting App",
    manualSplit: "Manual Split",
    quickSplit: "Quick Split",
    totalBill: "Total Bill (IQD)",
    addPerson: "Add Person",
    peopleSplit: "People to Split",
    numPeople: "Number of People",
    splitBill: "Split Bill",
    splitResult: "Split Result",
    total: "Total",
    enterName: "Enter person's name",
    name: "Name",
    add: "Add",
    peopleList: "People List",
  },
  ar: {
    title: "تطبيق تقسيم افاتورة",
    manualSplit: "تقسيم يدوي",
    quickSplit: "تقسيم سريع",
    totalBill: "إجمالي الفاتورة (دينار عراقي)",
    addPerson: "إضافة شخص",
    peopleSplit: "الأشخاص للتقسيم",
    numPeople: "عدد الأشخاص",
    splitBill: "تقسيم الفاتورة",
    splitResult: "نتيجة التقسيم",
    total: "المجموع",
    enterName: "أدخل اسم الشخص",
    name: "الاسم",
    add: "إضافة",
    peopleList: "قائمة الأشخاص",
  },
  tr: {
    title: "Hesap Bölme Uygulaması",
    manualSplit: "Manuel Bölme",
    quickSplit: "Hızlı Bölme",
    totalBill: "Toplam Hesap (IQD)",
    addPerson: "Kişi Ekle",
    peopleSplit: "Bölüşecek Kişiler",
    numPeople: "Kişi Sayısı",
    splitBill: "Hesabı Böl",
    splitResult: "Bölme Sonucu",
    total: "Toplam",
    enterName: "Kişinin adını girin",
    name: "Ad",
    add: "Ekle",
    peopleList: "Kişi Listesi",
  },
};

const Navbar: React.FC<{ language: string; setLanguage: (lang: string) => void }> = ({ language, setLanguage }) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="tr">Türkçe</SelectItem>
              </SelectContent>
            </Select>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

const BillSplittingApp: React.FC = () => {
  const [totalBill, setTotalBill] = useState<string>('');
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState<string>('');
  const [quickSplitCount, setQuickSplitCount] = useState<number>(2);
  const [splitResult, setSplitResult] = useState<Person[]>([]);
  const [activeTab, setActiveTab] = useState<"manual" | "quick">("quick");
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });

  const strings = languageStrings[language as keyof typeof languageStrings];

  const addPerson = () => {
    if (newPersonName.trim() !== '') {
      setPeople([...people, { name: newPersonName.trim(), amount: 0 }]);
      setNewPersonName('');
    }
  };

  const removePerson = (index: number) => {
    const newPeople = [...people];
    newPeople.splice(index, 1);
    setPeople(newPeople);
  };

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const splitBill = useCallback(() => {
    const bill = Math.round(parseFloat(totalBill) * 100);
    if (isNaN(bill) || bill <= 0) return;

    const count = activeTab === "quick" ? quickSplitCount : people.length;
    if (count === 0) return;

    const baseAmount = Math.floor(bill / count / 25000) * 25000;
    let remainder = bill - (baseAmount * count);

    let newSplitResult: Person[] = activeTab === "quick"
      ? Array.from({ length: count }, (_, i) => ({ name: `Person ${i + 1}`, amount: baseAmount }))
      : people.map(person => ({ ...person, amount: baseAmount }));

    const shuffledIndices = shuffleArray(Array.from({ length: count }, (_, i) => i));
    let index = 0;
    while (remainder > 0) {
      const extra = Math.min(25000, remainder);
      newSplitResult[shuffledIndices[index]].amount += extra;
      remainder -= extra;
      index = (index + 1) % count;
    }

    newSplitResult = newSplitResult.map(person => ({
      ...person,
      amount: person.amount / 100
    }));

    setSplitResult(newSplitResult);
  }, [totalBill, activeTab, quickSplitCount, people]);

  const formatCurrency = (amount: number): string => amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const renderPersonList = (personList: Person[], onRemove: ((index: number) => void) | null = null) => (
    <ScrollArea className="h-[20em]">
      {personList.map((person, index) => (
        <div key={index} className="flex items-center justify-between py-3 px-4 hover:bg-accent transition-colors">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {person.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{person.name}</span>
          </div>
          <div className="flex items-center space-x-3">
            {person.amount > 0 && (
              <span className="font-semibold text-primary">{formatCurrency(person.amount)} IQD</span>
            )}
            {onRemove && (
              <Button variant="ghost" size="icon" onClick={() => onRemove(index)} className="text-destructive hover:text-destructive-foreground">
                <MinusCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
  const renderPersonBadges = (personList: Person[], onRemove: (index: number) => void) => (
    <div className="flex flex-wrap gap-2 mt-4">
      {personList.map((person, index) => (
        <Badge key={index} variant="secondary" className="py-1 px-2 flex items-center space-x-1">
          <span>{person.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );

  const renderResultDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={splitBill}
          disabled={!totalBill || (activeTab === "manual" && people.length === 0)}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Shuffle className="h-5 w-5" /> {strings.splitBill}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{strings.splitResult}</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-lg font-semibold mb-2">{strings.totalBill}</div>
            <div className="text-3xl font-bold text-primary">{formatCurrency(parseFloat(totalBill))} IQD</div>
          </div>
          <div className="space-y-3 max-h-[30vh] overflow-y-auto">
            {splitResult.map((person, index) => (
              <div key={index} className="flex items-center justify-between bg-card p-3 rounded-md shadow-sm">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {person.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{person.name}</span>
                </div>
                <span className="font-semibold text-primary">{formatCurrency(person.amount)} IQD</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>{strings.total}</span>
            <span className="text-primary">
              {formatCurrency(splitResult.reduce((sum, person) => sum + person.amount, 0))} IQD
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const formatNumber = (num: string): string => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const unformatNumber = (num: string): string => {
    return num.replace(/,/g, "");
  };

  const handleTotalBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = unformatNumber(e.target.value);
    if (value === '' || /^\d+$/.test(value)) {
      setTotalBill(value);
    }
  };

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="flex h-lvh bg-background text-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex-1 flex flex-col">
        <Navbar language={language} setLanguage={handleLanguageChange} />
        <main className="flex-1 p-6 overflow-auto">
          <CardContent className="p-0">
            <Tabs defaultValue="quick" className="w-full" onValueChange={(value) => setActiveTab(value as "manual" | "quick")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="quick">{strings.quickSplit}</TabsTrigger>
                <TabsTrigger value="manual">{strings.manualSplit}</TabsTrigger>
              </TabsList>
              <TabsContent value="manual">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="totalBill" className="text-lg font-medium">{strings.totalBill}</Label>
                    <div className="relative">
                      <DollarSign className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="totalBill"
                        type="text"
                        value={formatNumber(totalBill)}
                        onChange={handleTotalBillChange}
                        className="ps-8"
                        placeholder={strings.totalBill}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full flex gap-2">
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button className='flex-1' variant="outline">
                            <PlusCircle className="h-4 w-4 mr-2" /> {strings.addPerson}
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>{strings.addPerson}</DrawerTitle>
                          </DrawerHeader>
                          <div className="p-4 space-y-4">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                  {newPersonName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Label htmlFor="name" className="text-sm font-medium">
                                  {strings.name}
                                </Label>
                                <Input
                                  id="name"
                                  value={newPersonName}
                                  onChange={(e) => setNewPersonName(e.target.value)}
                                  className="mt-1"
                                  placeholder={strings.enterName}
                                />
                              </div>
                            </div>
                          </div>
                          <DrawerFooter>
                            <Button onClick={addPerson} className="w-full">{strings.add}</Button>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                      {renderResultDialog()}
                    </div>
                  </div>
                  {people.length > 0 && renderPersonBadges(people, removePerson)}
                </div>
              </TabsContent>
              <TabsContent value="quick">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="quickTotalBill" className="text-lg font-medium">{strings.totalBill}</Label>
                    <div className="relative">
                      <DollarSign className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="quickTotalBill"
                        type="text"
                        value={formatNumber(totalBill)}
                        onChange={handleTotalBillChange}
                        className="ps-8"
                        placeholder={strings.totalBill}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quickSplitCount" className="text-lg font-medium">{strings.numPeople}</Label>
                    <div className="relative">
                      <Users className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="quickSplitCount"
                        type="number"
                        min="2"
                        value={quickSplitCount === 0 ? '' : quickSplitCount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setQuickSplitCount(0);
                          } else {
                            const numValue = parseInt(value);
                            setQuickSplitCount(isNaN(numValue) ? 0 : numValue);
                          }
                        }}
                        onBlur={() => {
                          if (quickSplitCount < 2) {
                            setQuickSplitCount(2);
                          }
                        }}
                        className="ps-8"
                        placeholder={strings.numPeople}
                      />
                    </div>
                  </div>
                  <div className="flex">
                    {renderResultDialog()}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

        </main>
      </div>
    </div>
  );
};

export default BillSplittingApp;