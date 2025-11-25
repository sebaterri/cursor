# towers.py

import pygame
import math

class Tower:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.damage = 10
        self.range = 100
        self.target_enemy = None

    def target(self, enemies):
        closest_enemy = None
        closest_distance = float('inf')
        for enemy in enemies:
            distance = math.sqrt((self.x - enemy.x)**2 + (self.y - enemy.y)**2)
            if distance <= self.range and distance < closest_distance:
                closest_distance = distance
                closest_enemy = enemy
        self.target_enemy = closest_enemy

    def attack(self):
        if self.target_enemy:
            # No damage, just slow
            self.apply_slow(self.target_enemy)
            return False  # Don't defeat enemy
        return False

    def apply_slow(self, enemy):
        enemy.speed = max(enemy.speed * 0.5, 0.2) # Reduce speed by 50%, but not below 0.2

    def draw(self, screen):
        pygame.draw.circle(screen, (0, 255, 0), (self.x, self.y), 20)

class LongRangeTower(Tower):
    def __init__(self, x, y):
        super().__init__(x, y)
        self.damage = 5
        self.range = 200

    def draw(self, screen):
        pygame.draw.circle(screen, (0, 0, 255), (self.x, self.y), 20)

class SlowingTower(Tower):
    def __init__(self, x, y):
        super().__init__(x, y)
        self.range = 80

    def attack(self):
        # Override attack to only apply slow
        if self.target_enemy:
            self.apply_slow(self.target_enemy)
            return False
        return False

    def draw(self, screen):
        pygame.draw.circle(screen, (200, 200, 200), (self.x, self.y), 20)
