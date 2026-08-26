import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-plant-green-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-6 h-6 text-plant-green-300" />
              <span className="font-bold text-lg">自生植物数据库</span>
            </div>
            <p className="text-plant-green-200 text-sm">
              黄河流域（河南段）自生植物多样性调查数据库查询系统
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-plant-green-300">功能导航</h4>
            <ul className="space-y-2 text-sm text-plant-green-200">
              <li><Link href="/browse" className="hover:text-white transition-colors">数据浏览</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">数据查询</Link></li>
              <li><Link href="/add" className="hover:text-white transition-colors">录入数据</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-plant-green-300">关于</h4>
            <p className="text-sm text-plant-green-200">
              本系统用于记录、查询与管理黄河流域（河南段）自生植物调查数据，
              共同构建不断丰富的植物多样性数据库。
            </p>
          </div>
        </div>

        <div className="border-t border-plant-green-800 mt-8 pt-6 text-center text-sm text-plant-green-300">
          <p>© 2024-2026 黄河流域（河南段）自生植物数据库. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
