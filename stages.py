# stages.py

import pygame
from enemies import Enemy, StrongEnemy, FastEnemy

class Stage:
    def __init__(self, waves, path):
        self.waves = waves
        self.current_wave = 0
        self.enemies = []
        self.path = path

    def spawn_enemies(self):
        if self.current_wave < len(self.waves):
            wave = self.waves[self.current_wave]
            for enemy_data in wave:
                enemy_type = enemy_data['type']
                enemy_count = enemy_data['count']
                for _ in range(enemy_count):
                    if enemy_type == 'basic':
                        enemy = Enemy(self.path)
                        self.add_enemy(enemy)
                    elif enemy_type == 'strong':
                        enemy = StrongEnemy(self.path)
                        self.add_enemy(enemy)
                    elif enemy_type == 'fast':
                        enemy = FastEnemy(self.path)
                        self.add_enemy(enemy)
            self.current_wave += 1

    def add_enemy(self, enemy):
        self.enemies.append(enemy)

    def update(self):
        for enemy in self.enemies:
            enemy.move()

    def draw(self, screen):
        for enemy in self.enemies:
            enemy.draw(screen)

    def add_enemy(self, enemy):
        self.enemies.append(enemy)

    def update(self):
        for enemy in self.enemies:
            enemy.move()

    def draw(self, screen):
        for enemy in self.enemies:
            enemy.draw(screen)

        for enemy in self.enemies:
            enemy.draw(screen)
