package neploxo.rest.stid.service;

import neploxo.rest.stid.model.Role;

import java.util.List;
import java.util.Set;

public interface RoleService {
    List<Role> findAllRole();
    void addDefaultRole();
    Set<Role> findByIdRoles(List<Long>roles);
}
