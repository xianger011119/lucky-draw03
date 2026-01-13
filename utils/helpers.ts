
import { Member, Group } from '../types';

export const parseNames = (input: string): Member[] => {
  const lines = input.split(/[\n,]/).map(name => name.trim()).filter(name => name !== '');
  const counts: Record<string, number> = {};
  
  lines.forEach(name => {
    counts[name] = (counts[name] || 0) + 1;
  });

  return lines.map((name, index) => ({
    id: `${name}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    isDuplicate: counts[name] > 1
  }));
};

// Fix: Use standard generic syntax <T> for better type inference in .ts files
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const downloadCSV = (groups: Group[]) => {
  const headers = "組別,姓名\n";
  const rows = groups.flatMap(group => 
    group.members.map(member => `第 ${group.id + 1} 組,${member.name}`)
  ).join("\n");
  
  const blob = new Blob(["\ufeff" + headers + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `分組結果_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
