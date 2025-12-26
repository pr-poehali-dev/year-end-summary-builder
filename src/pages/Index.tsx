import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Block {
  id: string;
  type: 'hero' | 'text' | 'image' | 'achievements' | 'gallery' | 'video' | 'music';
  content: any;
}

const Snowflake = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <div
    className="absolute text-white opacity-70 pointer-events-none animate-snow-fall"
    style={{
      left,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      fontSize: `${Math.random() * 10 + 10}px`,
    }}
  >
    ❄
  </div>
);

export default function Index() {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: '1',
      type: 'hero',
      content: {
        title: 'Мои итоги 2025 года',
        subtitle: 'Незабываемый год полный достижений',
      },
    },
    {
      id: '2',
      type: 'achievements',
      content: {
        items: [
          { emoji: '🎯', title: 'Цели достигнуты', count: '12/15' },
          { emoji: '📚', title: 'Книг прочитано', count: '24' },
          { emoji: '✈️', title: 'Стран посещено', count: '5' },
        ],
      },
    },
    {
      id: '3',
      type: 'gallery',
      content: {
        title: 'Лучшие моменты',
        images: [
          'https://images.unsplash.com/photo-1482575832494-771f74bf6857',
          'https://images.unsplash.com/photo-1512389142860-9c449e58a543',
          'https://images.unsplash.com/photo-1513151233558-d860c5398176',
        ],
      },
    },
    {
      id: '4',
      type: 'text',
      content: {
        title: 'Пожелания на новый год',
        text: 'Пусть следующий год будет еще ярче, насыщеннее и успешнее!',
      },
    },
  ]);

  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);

  const snowflakes = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 10,
    duration: Math.random() * 10 + 15,
    left: `${Math.random() * 100}%`,
  }));

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
    };
    setBlocks([...blocks, newBlock]);
    toast.success('Блок добавлен');
  };

  const getDefaultContent = (type: Block['type']) => {
    switch (type) {
      case 'hero':
        return { title: 'Заголовок', subtitle: 'Подзаголовок' };
      case 'text':
        return { title: 'Заголовок', text: 'Текст раздела' };
      case 'image':
        return { url: 'https://images.unsplash.com/photo-1482575832494-771f74bf6857', caption: '' };
      case 'achievements':
        return { items: [{ emoji: '🎉', title: 'Достижение', count: '10' }] };
      case 'gallery':
        return { title: 'Галерея', images: [] };
      case 'video':
        return { url: '', title: 'Видео' };
      case 'music':
        return { url: '', title: 'Музыка' };
      default:
        return {};
    }
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    toast.success('Блок удален');
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
    toast.success('Блок обновлен');
  };

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 text-center text-white px-6 animate-fade-in">
              <h1 className="text-6xl md:text-8xl font-bold mb-4">{block.content.title}</h1>
              <p className="text-xl md:text-2xl opacity-90">{block.content.subtitle}</p>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="py-20 px-6 bg-gradient-to-b from-background to-muted">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Мои достижения</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {block.content.items.map((item: any, idx: number) => (
                  <Card
                    key={idx}
                    className="p-8 text-center hover:shadow-xl transition-all hover:scale-105 animate-scale-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="text-6xl mb-4">{item.emoji}</div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-4xl font-bold text-primary">{item.count}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="py-20 px-6 bg-background">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">{block.content.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {block.content.images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="aspect-square overflow-hidden rounded-lg hover:scale-105 transition-transform animate-scale-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="py-20 px-6 bg-gradient-to-b from-muted to-background">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{block.content.title}</h2>
              <p className="text-xl md:text-2xl leading-relaxed opacity-80">{block.content.text}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-muted-foreground">Блок типа {block.type}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {snowflakes.map((snow) => (
        <Snowflake key={snow.id} delay={snow.delay} duration={snow.duration} left={snow.left} />
      ))}

      <div className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            ✨ Итоги года
          </h1>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Icon name="Plus" className="mr-2 h-4 w-4" />
                  Добавить блок
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Выберите тип блока</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    { type: 'hero' as const, icon: 'Sparkles', label: 'Обложка' },
                    { type: 'text' as const, icon: 'Type', label: 'Текст' },
                    { type: 'image' as const, icon: 'Image', label: 'Изображение' },
                    { type: 'achievements' as const, icon: 'Trophy', label: 'Достижения' },
                    { type: 'gallery' as const, icon: 'Images', label: 'Галерея' },
                    { type: 'video' as const, icon: 'Video', label: 'Видео' },
                    { type: 'music' as const, icon: 'Music', label: 'Музыка' },
                  ].map((item) => (
                    <Button
                      key={item.type}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={() => addBlock(item.type)}
                    >
                      <Icon name={item.icon} className="h-6 w-6" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="default" size="sm">
              <Icon name="Download" className="mr-2 h-4 w-4" />
              Экспорт
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`relative group ${selectedBlock === block.id ? 'ring-4 ring-primary' : ''}`}
            onClick={() => setSelectedBlock(block.id)}
          >
            {renderBlock(block)}

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBlock(block);
                    }}
                  >
                    <Icon name="Edit" className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Редактировать блок</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {block.type === 'hero' && (
                      <>
                        <Input
                          placeholder="Заголовок"
                          defaultValue={block.content.title}
                          onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                        />
                        <Input
                          placeholder="Подзаголовок"
                          defaultValue={block.content.subtitle}
                          onChange={(e) => updateBlock(block.id, { ...block.content, subtitle: e.target.value })}
                        />
                      </>
                    )}
                    {block.type === 'text' && (
                      <>
                        <Input
                          placeholder="Заголовок"
                          defaultValue={block.content.title}
                          onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                        />
                        <Textarea
                          placeholder="Текст"
                          defaultValue={block.content.text}
                          rows={5}
                          onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                        />
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBlock(block.id);
                }}
              >
                <Icon name="Trash2" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Icon name="FileText" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-4">Начните создавать свои итоги года</p>
            <Button onClick={() => addBlock('hero')}>
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Добавить первый блок
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
