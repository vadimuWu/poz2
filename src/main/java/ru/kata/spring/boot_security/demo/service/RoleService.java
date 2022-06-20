package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;

public interface RoleService {
    List<Role> findAll();
    Role findByName(String name);
}
